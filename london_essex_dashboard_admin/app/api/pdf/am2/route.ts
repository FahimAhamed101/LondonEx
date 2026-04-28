import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

export const dynamic = "force-dynamic";

function getBrowserExecutablePath() {
  const candidates = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  ].filter((candidatePath): candidatePath is string => Boolean(candidatePath));

  return candidates.find((candidatePath) => fs.existsSync(candidatePath));
}

export async function GET(request: Request) {
  const executablePath = getBrowserExecutablePath();

  if (!executablePath) {
    return new Response(
      "No local Chrome/Edge executable was found for PDF generation.",
      { status: 500 },
    );
  }

  const { searchParams, origin } = new URL(request.url);
  const template = searchParams.get("template") || "am2-checklist";
  const rawFileName = searchParams.get("fileName") || "am2-checklist.pdf";
  const fileName = rawFileName.endsWith(".pdf")
    ? rawFileName
    : `${rawFileName}.pdf`;

  const previewUrl = new URL("/checklist-template", origin);
  
  // Forward all search params to the template page
  for (const [key, value] of searchParams.entries()) {
    previewUrl.searchParams.set(key, value);
  }
  
  previewUrl.searchParams.set("pdf", "1");


  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--font-render-hinting=none",
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 });
    await page.goto(previewUrl.toString(), { waitUntil: "networkidle0" });
    await page.emulateMediaType("print");

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
      },
    });
    const pdfBytes = new Uint8Array(pdf.byteLength);
    pdfBytes.set(pdf);
    const pdfBlob = new Blob([pdfBytes.buffer], {
      type: "application/pdf",
    });

    return new Response(pdfBlob, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${path.basename(fileName)}"`,
        "Cache-Control": "no-store",
      },
    });
  } finally {
    await browser.close();
  }
}
