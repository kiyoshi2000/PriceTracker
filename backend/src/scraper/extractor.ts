import puppeteer from "puppeteer";

export async function scrapeAmazonProduct(url: string) {
  const browser = await puppeteer.launch({
    headless: "shell",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  let name: string | null = null;
  let price: number | null = null;

  try {
    name = await page.$eval("#productTitle", el =>
      (el as HTMLElement).innerText.trim()
    );
  } catch {}

  try {
    const priceText = await page.$eval(".a-price .a-offscreen", el =>
      (el as HTMLElement).innerText.replace(/[^\d,\.]/g, "")
    );

    price = parseFloat(priceText.replace(",", "."));
  } catch {}

  await browser.close();

  if (!name || !price) return null;

  return { name, price };
}
