#!/bin/bash

echo "📦 Creating PriceTracker Pro structure..."

mkdir -p price-tracker-pro
cd price-tracker-pro

############################################
# BACKEND
############################################
mkdir -p backend/src/{routes,scraper,jobs,notifications,db}
mkdir -p backend/prisma

# --- Backend Files ---

# package.json
cat << 'EOF' > backend/package.json
{
  "name": "price-tracker-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "ts-node-dev src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev"
  },
  "dependencies": {
    "fastify": "^4.25.0",
    "@fastify/cors": "^8.5.0",
    "puppeteer": "^22.0.0",
    "node-cron": "^3.0.2",
    "nodemailer": "^6.9.10",
    "@prisma/client": "^5.11.0"
  },
  "devDependencies": {
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.3.3",
    "prisma": "^5.11.0"
  }
}
EOF

# tsconfig.json
cat << 'EOF' > backend/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Node",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true
  }
}
EOF

# Prisma schema
cat << 'EOF' > backend/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model Item {
  id         Int       @id @default(autoincrement())
  name       String
  url        String
  createdAt  DateTime  @default(now())
  prices     Price[]
  watchers   Watch[]
}

model Price {
  id        Int      @id @default(autoincrement())
  value     Float
  createdAt DateTime @default(now())
  itemId    Int
  Item      Item     @relation(fields: [itemId], references: [id])
}

model Watch {
  id          Int      @id @default(autoincrement())
  threshold   Float
  chatId      String
  itemId      Int
  Item        Item     @relation(fields: [itemId], references: [id])
}
EOF

# prisma.ts
cat << 'EOF' > backend/src/db/prisma.ts
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();
EOF

# puppeteer.ts
cat << 'EOF' > backend/src/scraper/puppeteer.ts
import puppeteer from "puppeteer";

export async function scrapePrice(url: string): Promise<number | null> {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });

  const selectors = [
    "#priceblock_ourprice",
    "#priceblock_dealprice",
    ".a-price-whole",
    ".price__SalesPrice",
    ".offer-price"
  ];

  let price = null;

  for (const sel of selectors) {
    try {
      const text = await page.$eval(sel, el => el.textContent);
      if (text) {
        price = parseFloat(text.replace(/[^0-9,\.]/g, "").replace(",", "."));
        break;
      }
    } catch {}
  }

  await browser.close();
  return price;
}
EOF

# scheduler.ts
cat << 'EOF' > backend/src/jobs/scheduler.ts
import cron from "node-cron";
import { prisma } from "../db/prisma.js";
import { scrapePrice } from "../scraper/puppeteer.js";
import { notifyTelegram } from "../notifications/telegram.js";

export function initScheduler() {
  cron.schedule("*/30 * * * *", async () => {
    console.log("🔄 Running scheduled price check...");

    const items = await prisma.item.findMany({ include: { watchers: true } });

    for (const item of items) {
      const price = await scrapePrice(item.url);
      if (!price) continue;

      await prisma.price.create({
        data: { value: price, itemId: item.id }
      });

      for (const w of item.watchers) {
        if (price <= w.threshold) {
          await notifyTelegram(w.chatId, `🔥 Oferta! ${item.name} caiu para R$${price}`);
        }
      }
    }
  });
}
EOF

# notifications/telegram.ts
cat << 'EOF' > backend/src/notifications/telegram.ts
import fetch from "node-fetch";

const TOKEN = process.env.TELEGRAM_TOKEN;

export async function notifyTelegram(chatId: string, message: string) {
  const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: message })
  });
}
EOF

# routes/items.ts
cat << 'EOF' > backend/src/routes/items.ts
import { FastifyInstance } from "fastify";
import { prisma } from "../db/prisma.js";
import { scrapePrice } from "../scraper/puppeteer.js";

export default async function routes(fastify: FastifyInstance) {

  fastify.get("/items", async () => {
    return prisma.item.findMany();
  });

  fastify.post("/items", async (req: any) => {
    const { name, url } = req.body;
    return prisma.item.create({ data: { name, url } });
  });

  fastify.get("/items/:id", async (req: any) => {
    return prisma.item.findUnique({
      where: { id: Number(req.params.id) },
      include: { prices: true }
    });
  });

  fastify.post("/items/:id/scrape", async (req: any) => {
    const item = await prisma.item.findUnique({ where: { id: Number(req.params.id) } });
    if (!item) return { error: "Item not found" };

    const price = await scrapePrice(item.url);
    if (!price) return { error: "Could not extract price" };

    await prisma.price.create({
      data: { value: price, itemId: item.id }
    });

    return { price };
  });
}
EOF

# server.ts
cat << 'EOF' > backend/src/server.ts
import Fastify from "fastify";
import cors from "@fastify/cors";
import { initScheduler } from "./jobs/scheduler.js";
import itemsRoutes from "./routes/items.js";

const app = Fastify({ logger: true });

app.register(cors, { origin: "*" });
app.register(itemsRoutes);

initScheduler();

app.listen({ port: 3001 }, () => {
  console.log("🚀 Backend running at http://localhost:3001");
});
EOF

############################################
# FRONTEND
############################################

mkdir -p frontend/{app,components,public}

# package.json
cat << 'EOF' > frontend/package.json
{
  "name": "price-tracker-frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "latest",
    "react": "latest",
    "react-dom": "latest",
    "swr": "^2.2.0",
    "recharts": "^2.12.0",
    "tailwindcss": "^3.3.0"
  }
}
EOF

# tsconfig
cat << 'EOF' > frontend/tsconfig.json
{
  "compilerOptions": {
    "jsx": "preserve",
    "module": "esnext",
    "target": "esnext",
    "moduleResolution": "node",
    "strict": true
  }
}
EOF

# layout.tsx
cat << 'EOF' > frontend/app/layout.tsx
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
EOF

# page.tsx
cat << 'EOF' > frontend/app/page.tsx
"use client";

import useSWR from "swr";

const fetcher = url => fetch(url).then(r => r.json());

export default function Page() {
  const { data } = useSWR("http://localhost:3001/items", fetcher);

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">PriceTracker Dashboard</h1>
      <div className="grid grid-cols-3 gap-4 mt-6">
        {data?.map(item => (
          <a key={item.id} href={`/item/${item.id}`} className="border p-4 rounded shadow">
            <h2 className="text-xl">{item.name}</h2>
            <p className="text-sm text-gray-600">{item.url}</p>
          </a>
        ))}
      </div>
    </main>
  );
}
EOF

# dynamic item page folder
mkdir -p frontend/app/item/[id]

cat << 'EOF' > frontend/app/item/[id]/page.tsx
"use client";

import useSWR from "swr";
import PriceChart from "../../../components/PriceChart";

const fetcher = url => fetch(url).then(r => r.json());

export default function ItemPage({ params }) {
  const { data } = useSWR(\`http://localhost:3001/items/\${params.id}\`, fetcher);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{data.name}</h1>
      <a href={data.url} className="text-blue-600 underline" target="_blank">
        Link do produto
      </a>

      <div className="mt-6">
        <PriceChart prices={data.prices} />
      </div>
    </div>
  );
}
EOF

# PriceChart.tsx
cat << 'EOF' > frontend/components/PriceChart.tsx
"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function PriceChart({ prices }) {
  const data = prices.map(p => ({
    date: new Date(p.createdAt).toLocaleDateString(),
    price: p.value
  }));

  return (
    <LineChart width={700} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={2} />
    </LineChart>
  );
}
EOF

############################################
# DOCKER & ROOT FILES
############################################

cat << 'EOF' > docker-compose.yml
version: "3.9"

services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    volumes:
      - ./backend:/app
    environment:
      TELEGRAM_TOKEN: "YOUR_TELEGRAM_TOKEN"

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
    depends_on:
      - backend
EOF

# blank README for user to fill
echo "# PriceTracker Pro" > README.md

echo "✅ Project structure created successfully!"
