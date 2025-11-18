import { FastifyInstance } from "fastify";
import { prisma } from "../db/prisma";
import { scrapePrice } from "../scraper/puppeteer";



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
