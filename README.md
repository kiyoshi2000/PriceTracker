# **PriceTracker — Full-Stack Price Monitoring App**

*A modern full-stack application for tracking product prices with automated scraping.*

---

## 🚀 Features

### **Backend (Fastify + TypeScript + Prisma)**

* Fast and lightweight API using Fastify
* TypeScript everywhere
* SQLite + Prisma ORM
* Automatic scraping from Amazon
* Price history storage
* API endpoints for:

  * Create product
  * Fetch product list
  * Fetch product details
  * Trigger manual price refresh
  * Remove product (coming soon)

---

### **Frontend (Next.js 14 + TailwindCSS + ShadCN UI)**

* Clean UI with modern components
* Product dashboard
* Dialog modal to add new items
* Price history line chart
* Responsive layout
* Professional UI components (ShadCN)

---

### **DevOps & Deployment**

* Full Docker support
* Docker Compose for multi-service setup
* Hot reload in development
* Prisma Client generated for Linux (Docker-ready)

---

## 🏗️ Project Structure

```
PriceTracker/
│
├── backend/          # Fastify API + Prisma + Scraper
│   ├── src/
│   ├── prisma/
│   ├── Dockerfile
│   └── package.json
│
├── frontend/         # Next.js + Tailwind + ShadCN
│   ├── app/
│   ├── components/
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## 🐳 Running with Docker

### **1️⃣ Build images**

```bash
docker compose build --no-cache
```

### **2️⃣ Start containers**

```bash
docker compose up
```

### **3️⃣ Access services**

* Frontend → [http://localhost:3000](http://localhost:3000)
* Backend → [http://localhost:3001](http://localhost:3001)

---

## 🔌 API Endpoints (Backend)

| Method | Endpoint          | Description                        |
| ------ | ----------------- | ---------------------------------- |
| POST   | /items/auto       | Add product by URL (scrape + save) |
| GET    | /items            | List all items                     |
| GET    | /items/:id        | Get item details                   |
| POST   | /items/:id/scrape | Refresh price manually             |

Example request:

```bash
curl -X POST http://localhost:3001/items/auto \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.amazon.com/..."}'
```

---

## Frontend Screenshots

(images later)

---

## Technologies Used

### **Backend**

* Fastify
* TypeScript
* Prisma ORM
* Cheerio (HTML scraping)
* Node-fetch
* Docker

### **Frontend**

* Next.js 14
* Tailwind CSS
* ShadCN UI
* SWR
* Recharts

---

##  Roadmap (Future Improvements)

* Email / Telegram notifications
* User authentication
* Multiple scraping providers (Amazon, eBay, etc.)
* Cron jobs for automatic scraping

---

## 👨‍💻 Author

**Kiyoshi Araki**
Full-stack developer & AI engineer
🇫🇷 France | 🇧🇷 Brazil

---

