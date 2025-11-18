import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

// Ativa o stealth (bypass básico da Amazon)
puppeteer.use(StealthPlugin());

export async function scrapePrice(url: string): Promise<number | null> {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
        "--disable-dev-shm-usage",
      ],
    });

    const page = await browser.newPage();

    // Header real para se passar como usuário real
    await page.setExtraHTTPHeaders({
      "Accept-Language": "pt-PT,pt;q=0.9,en;q=0.8",
    });

    // User agent real
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    );

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    // Scroll para forçar carregamento
    await page.evaluate(() => window.scrollBy(0, 500));

    // SELETORES MAIS ROBUSTOS PARA A AMAZON (20+ tipos)
    const selectors = [
      "#priceblock_ourprice",
      "#priceblock_dealprice",
      "#corePrice_feature_div .a-price .a-offscreen",
      ".a-price.aok-align-center .a-offscreen",
      ".a-price .a-offscreen",
      ".a-color-price",
      "span[data-a-color='price']",
      "span.a-price.a-text-price",
      "#tp_price_block_total_price_ww",
    ];

    for (const selector of selectors) {
      const element = await page.$(selector);
      if (element) {
        const text = await page.evaluate(el => el.textContent, element);
        const parsed = extractPrice(text);
        if (parsed) return parsed;
      }
    }

    // -------------- FALLBACK TOTAL -----------------
    // Caso a Amazon esconda o DOM, extrai de TODO O HTML
    const html = await page.content();
    const fallbackPrice = findPriceInHTML(html);
    if (fallbackPrice) return fallbackPrice;

    return null;
  } catch (err) {
    console.error("❌ Scraper error:", err);
    return null;
  } finally {
    if (browser) await browser.close();
  }
}

// Extrai número de strings tipo "EUR 199,99" ou "R$ 1.299,90"
function extractPrice(text: string | null): number | null {
  if (!text) return null;

  // Remove espaços, emojis, símbolos duplicados
  text = text.replace(/\s+/g, " ").trim();

  // RegEx para preços internacionais
  const regex =
    /(\d{1,3}(?:[\.\,]\d{3})*(?:[\.,]\d{2}))/;

  const match = text.match(regex);
  if (!match) return null;

  let price = match[1];

  // Normaliza formato europeu "199,99"
  if (price.includes(",")) {
    price = price.replace(/\./g, "").replace(",", ".");
  }

  const num = parseFloat(price);
  return isNaN(num) ? null : num;
}

// Busca números de preço dentro do HTML inteiro
function findPriceInHTML(html: string): number | null {
  const regex =
    /(\d{1,3}(?:[\.\,]\d{3})*(?:[\.,]\d{2}))/g;

  const matches = [...html.matchAll(regex)];

  if (!matches.length) return null;

  // Heurística: menor preço costuma ser o principal
  const candidates = matches
    .map(m => m[1])
    .map(s => {
      let p = s;
      if (p.includes(",")) p = p.replace(/\./g, "").replace(",", ".");
      return parseFloat(p);
    })
    .filter(n => !isNaN(n) && n < 10000); // ignora preços irreais

  if (candidates.length === 0) return null;

  return Math.min(...candidates);
}
