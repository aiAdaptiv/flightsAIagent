import { compile } from "handlebars";
import puppeteer from "puppeteer-core";
import template from "../templates/reports/main.hbs";

export async function generateReport(data: any) {
  const html = compile(template)(data);
  const browser = await puppeteer.connect({
    browserWSEndpoint: process.env.BROWSERLESS_URL,
  });
  const page = await browser.newPage();
  await page.setContent(html);
  return page.pdf({ format: "A4" });
}
