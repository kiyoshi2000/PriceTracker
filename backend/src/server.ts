import Fastify from "fastify";
import cors from "@fastify/cors";

import { initScheduler } from "./jobs/scheduler";
import itemsRoutes from "./routes/items";

async function start() {
  const app = Fastify({ logger: true });

  // Registrar CORS (sem top-level await)
  await app.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  });

  // Registrar rotas
  await app.register(itemsRoutes);

  // Iniciar scheduler
  initScheduler();

  try {
    await app.listen({ port: 3001, host: "0.0.0.0" });
    console.log("🚀 Backend running at http://localhost:3001");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
