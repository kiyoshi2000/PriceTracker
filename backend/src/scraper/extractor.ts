import puppeteer from "puppeteer";

export async function scrapeAmazonProduct(url: string) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox"]
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  await page.waitForSelector("#productTitle");

  const name = await page.$eval("#productTitle", el =>
    el.textContent.trim()
  );

  // Preço — Amazon ES/BR/US
  let price = null;

  const selectors = [
    "#priceblock_ourprice",
    "#priceblock_dealprice",
    ".a-price-whole"
  ];

  for (const sel of selectors) {
    try {
      const p = await page.$eval(sel, el => el.textContent.replace(/[^\d.,]/g, ""));
      price = parseFloat(p.replace(".", "").replace(",", "."));
      break;
    } catch (_) {
      // continua tentando
    }
  }

  await browser.close();

  if (!price) return null;

  return { name, price };
}
