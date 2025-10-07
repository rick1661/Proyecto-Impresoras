
import axios from 'axios';
import { load } from 'cheerio';
import https from 'https';

// Cambia esta IP por la IP real de tu impresora
const PRINTER_URL = 'https://192.168.85.113/sws/index.html';

// Ignorar certificados autofirmados
const agent = new https.Agent({ rejectUnauthorized: false });

async function obtenerNivelToner() {
  try {
    const response = await axios.get(PRINTER_URL, { httpsAgent: agent });

    const html = response.data;
    const $ = load(html);

    // Imprime un resumen del HTML para inspección
    console.log('--- Resumen del HTML recibid0o ---');
    console.log(html.substring(0, 1000000)); // Solo los primeros 1000 caracteres
    console.log('---------------------------------');

    // Imprimir todos los textos de .x-column para depuración
    console.log('--- Textos encontrados en .x-column ---');
    $('.x-column').each((i, el) => {
      const texto = $(el).text().trim();
      console.log(`Elemento ${i}: '${texto}'`);
    });
    console.log('--------------------------------------');

    // ...puedes volver a agregar la lógica de extracción después de revisar la salida...
  } catch (error) {
    console.error('❌ Error al conectar con la impresora:', error.message);
  }
}

obtenerNivelToner();
