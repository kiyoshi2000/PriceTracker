import fastify from "fastify";
import cors from "@fastify/cors";
import { itemRoutes } from "./routes/items";

const app = fastify({ logger: true });

app.register(cors, { origin: "*" });
app.register(itemRoutes);

app.get("/", () => ({ status: "API online" }));

const start = async () => {
  try {
    await app.listen({ port: 3001, host: "0.0.0.0" });
    console.log("🚀 Backend rodando em http://localhost:3001");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
