import cron from "node-cron";
import { prisma } from "../db/prisma";
import { scrapePrice } from "../scraper/puppeteer";
import { notifyTelegram } from "../notifications/telegram";


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
