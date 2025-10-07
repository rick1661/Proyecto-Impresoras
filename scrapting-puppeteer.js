import puppeteer from 'puppeteer';

const PRINTER_URL = 'https://192.168.85.110/sws/index.html';

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--ignore-certificate-errors'] });
  const page = await browser.newPage();
  await page.goto(PRINTER_URL, { waitUntil: 'networkidle2' });

  // Espera a que aparezca algún elemento con la clase x-column
  await page.waitForSelector('.x-column', { timeout: 10000 }).catch(() => {});

  // Extrae todos los textos de los elementos .x-column que terminen en %
  const niveles = await page.$$eval('.x-column', nodes =>
    nodes
      .map(n => n.textContent.trim())
      .filter(t => /\d{1,3}%$/.test(t))
  );

  if (niveles.length > 0) {
    console.log('🔋 Niveles de tóner encontrados:', niveles.join(', '));
  } else {
    console.log('❌ No se encontró información del nivel de tóner.');
  }

  await browser.close();
})();
