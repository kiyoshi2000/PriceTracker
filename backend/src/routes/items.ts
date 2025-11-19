import { FastifyInstance } from "fastify";
import { prisma } from "../db/prisma";
import { scrapeAmazonProduct } from "../scraper/extractor";

export async function itemRoutes(fastify: FastifyInstance) {

  // ===> Cadastro simples (compatível com o frontend)
  fastify.post("/items", async (req, reply) => {
    const { name, url } = req.body as { name: string; url: string };

    if (!name || !url) {
      return reply.code(400).send({ error: "Nome e URL são obrigatórios" });
    }

    const item = await prisma.item.create({
      data: { name, url }
    });

    return reply.code(201).send(item);
  });

  // ===> Cadastro automático (scrape imediato)
  fastify.post("/items/auto", async (req, reply) => {
    const { url } = req.body as { url: string };

    if (!url) {
      return reply.code(400).send({ error: "URL é obrigatória" });
    }

    const scraped = await scrapeAmazonProduct(url);
    if (!scraped) {
      return reply.code(500).send({ error: "Falha ao obter informações do produto" });
    }

    const { name, price } = scraped;

    const item = await prisma.item.create({
      data: { name, url }
    });

    await prisma.price.create({
      data: { value: price, itemId: item.id }
    });

    return reply.send({
      id: item.id,
      name,
      url,
      initialPrice: price,
      message: "Produto adicionado com sucesso"
    });
  });

  // ===> Lista de itens
  fastify.get("/items", async () => {
    return prisma.item.findMany({
      include: { prices: true }
    });
  });

  // ===> Detalhes
  fastify.get("/items/:id", async (req) => {
    const { id } = req.params as { id: string };
    return prisma.item.findUnique({
      where: { id: Number(id) },
      include: { prices: true }
    });
  });

  // ===> Scrape manual
  fastify.post("/items/:id/scrape", async (req, reply) => {
    const { id } = req.params as { id: string };

    const item = await prisma.item.findUnique({
      where: { id: Number(id) }
    });

    if (!item) {
      return reply.code(404).send({ error: "Item não encontrado" });
    }

    const scraped = await scrapeAmazonProduct(item.url);
    if (!scraped) {
      return reply.code(500).send({ error: "Falha no scraper" });
    }

    await prisma.price.create({
      data: { value: scraped.price, itemId: Number(id) }
    });

    return { price: scraped.price };
  });

    // ===> Remover item
  fastify.delete("/items/:id", async (req, reply) => {
    const { id } = req.params as { id: string };

    // remove preços associados
    await prisma.price.deleteMany({
      where: { itemId: Number(id) }
    });

    // remove item
    await prisma.item.delete({
      where: { id: Number(id) }
    });

    return reply.code(200).send({ message: "Item removido" });
  });


}
