import snmp from 'net-snmp';
import puppeteer from 'puppeteer';
import { impresoraIpModelo } from './impresora.controllers.js';

let tonerCacheColor = {}; // Caché en memoria para niveles de tóner
let tonerCacheScraping = {}; // Caché en memoria para niveles de tóner
let tonerCacheNegro = {}; // Caché en memoria para niveles de tóner

const modelosColor = [
    'E47528',
    'P57750 XC',
    'MFP M283fdw',
    'MFP P57750',
    'MFP E47528',
    'MFP P57750 XC'
];

const modelosScraping = [
    "408dn",
    "MFP M232",
    "MFP 432",
    "M432",
    "MFP M432"
];

// Función para precargar niveles de tóner en caché
async function precargarNivelesToner() {
    const impresoras = await impresoraIpModelo();
    // Usar un bucle for...of y await para asegurarnos de que las instancias de Puppeteer
    // se cierran antes de iniciar la siguiente petición y evitar procesos/ventanas huérfanas.
    for (const element of impresoras) {
        try {
            if (modelosColor.includes(element.modelo)) {
                tonerCacheColor[element.direccionIp] = await obtenerNivelesTonerColor(element.direccionIp);
                console.log(`Niveles de tóner (color) para ${element.direccionIp} modelo ${element.modelo}:`);
                console.log(tonerCacheColor[element.direccionIp]);

            } else if (modelosScraping.includes(element.modelo)) {
                try {
                    // obtenerNivelesTonerScraping maneja el cierre del browser en su finally
                    tonerCacheScraping[element.direccionIp] = await obtenerNivelesTonerScraping(element.direccionIp);
                    console.log(`Niveles de tóner (scraping) para ${element.direccionIp} modelo ${element.modelo}:`);
                    console.log(tonerCacheScraping[element.direccionIp]);
                } catch (err) {
                    console.warn(`Scraping falló para ${element.direccionIp}:`, err.message || err);
                    // Guardar valor nulo o un estado de error para que consumers sepan que falló
                    tonerCacheScraping[element.direccionIp] = null;
                }
            } else {
                tonerCacheNegro[element.direccionIp] = await obtenerNivelesTonerNegro(element.direccionIp);
                console.log(`Niveles de tóner (negro) para ${element.direccionIp} modelo ${element.modelo}:`);
                console.log(tonerCacheNegro[element.direccionIp]);
            }
        } catch (error) {
            console.error('Error precargando niveles para', element.direccionIp, error);
        }
    }

}

function obtenerNivelesTonerNegro(ip) {
    return new Promise((resolve) => {
        const community = 'public';
        const oidNegro = '1.3.6.1.2.1.43.11.1.1.9.1.1'; // OID de tóner negro
        const options = { timeout: 5000 };
        const session = snmp.createSession(ip, community, options);

        session.get([oidNegro], (error, varbinds) => {
            if (error) {
                console.error('Error SNMP:', error);
                resolve('inaccesible');
            } else {
                const tonerLevel = varbinds[0]?.value;
                resolve(tonerLevel);
            }
            session.close();
        });
    });
}

function obtenerNivelesTonerColor(ip) {

    return new Promise((resolve, reject) => {
        console.log(`Conectando a la impresora con IP: ${ip}`);
        const community = 'public';
        const options = { timeout: 5000 };
        // OIDs estándar para negro, cyan, magenta, amarillo
        const oids = [
            { color: 'black', oid: '1.3.6.1.2.1.43.11.1.1.9.1.1' },
            { color: 'cyan', oid: '1.3.6.1.2.1.43.11.1.1.9.1.2' },
            { color: 'magenta', oid: '1.3.6.1.2.1.43.11.1.1.9.1.3' },
            { color: 'yellow', oid: '1.3.6.1.2.1.43.11.1.1.9.1.4' }
        ];
        const session = snmp.createSession(ip, community, options);

        session.get(oids.map(o => o.oid), (error, varbinds) => {
            if (error) {
                if (error.name === 'RequestTimedOutError') {
                    console.error(`SNMP timeout en ${ip}`);
                    reject(new Error(`La impresora ${ip} no respondió a SNMP (timeout)`));
                } else {
                    console.error('Error SNMP:', error);
                    reject(error);
                }
            } else {
                const tonerLevels = {};
                oids.forEach((o, i) => {
                    tonerLevels[o.color] = varbinds[i]?.value ?? null;
                });
                resolve({ ip, tonerLevels });
            }
            session.close();
        });
    });
}

function obtenerNivelesTonerScraping(ip) {
    return new Promise(async (resolve, reject) => {
        const url = `https://${ip}/sws/index.html`;
        let browser;
        try {
            browser = await puppeteer.launch({ headless: true, args: ['--ignore-certificate-errors'] });
            const page = await browser.newPage();
            await page.goto(url, { waitUntil: 'networkidle2' });

            // Espera a que aparezca algún elemento con la clase x-column
            await page.waitForSelector('.x-column', { timeout: 10000 });
            const niveles = await page.$$eval('.x-column', nodes =>
                nodes
                    .map(n => n.textContent.trim())
                    .filter(t => /\d{1,3}%$/.test(t))
            );
            if (niveles.length > 0) {
                resolve({ ip, niveles });
            } else {
                reject(new Error('No se encontraron niveles de tóner'));
            }
        } catch (error) {
            console.error('Error en el scraping:', error);
            reject(error);
        } finally {
            if (browser) {
                await browser.close();
            }
        }
    });
}

export const getTonerNegro = async (req, res) => {
    const ip = req.params.ip;
    console.log(` SNMP Conectando a la impresora con IP: ${ip}`);
    const datos = tonerCacheNegro[ip];
    if (datos) {
        res.json({ ip, tonerLevel: datos });
    } else {
        res.status(404).json({ ip, error: 'No hay datos en cache para esta impresora.' });
    }
    // const community = 'public';
    // const oidNegro = '1.3.6.1.2.1.43.11.1.1.9.1.1'; // OID de tóner negro
    // const session = snmp.createSession(ip, community);

    // session.get([oidNegro], (error, varbinds) => {
    //     if (error) {
    //         console.error('Error SNMP:', error);
    //         res.status(500).json({ error: 'Error al consultar la impresora' });
    //     } else {
    //         const tonerLevel = varbinds[0]?.value;
    //         res.json({ ip, tonerLevel });
    //     }
    //     session.close();
    // });
};

export const getTonersColor = async (req, res) => {
    const ip = req.params.ip;
    console.log(`SNMP Color Conectando a la impresora con IP: ${ip}`);
    const datos = tonerCacheColor[ip];
    if (datos && datos.tonerLevels) {
        res.json({ ip, tonerLevels: datos.tonerLevels });
    } else {
        res.status(404).json({ ip, error: 'No hay datos en cache para esta impresora.' });
    }
    // const community = 'public';
    // // OIDs estándar para negro, cyan, magenta, amarillo
    // const oids = [
    //     { color: 'black', oid: '1.3.6.1.2.1.43.11.1.1.9.1.1' },
    //     { color: 'cyan', oid: '1.3.6.1.2.1.43.11.1.1.9.1.2' },
    //     { color: 'magenta', oid: '1.3.6.1.2.1.43.11.1.1.9.1.3' },
    //     { color: 'yellow', oid: '1.3.6.1.2.1.43.11.1.1.9.1.4' }
    // ];
    // const session = snmp.createSession(ip, community);

    // session.get(oids.map(o => o.oid), (error, varbinds) => {
    //     if (error) {
    //         console.error('Error SNMP:', error);
    //         res.status(500).json({ error: 'Error al consultar la impresora' });
    //     } else {
    //         const tonerLevels = {};
    //         oids.forEach((o, i) => {
    //             tonerLevels[o.color] = varbinds[i]?.value ?? null;
    //         });
    //         res.json({ ip, tonerLevels });
    //     }
    //     session.close();
    // });
};


export const getTonerScraping = async (req, res) => {
    const ip = req.params.ip;
    console.log("scraping obteniendo datos de la IP: " + ip);
    const datos = tonerCacheScraping[ip];
    if (datos && datos.niveles) {
        res.json({ ip, niveles: datos.niveles });
    } else {
        res.status(404).json({ ip, error: 'No hay datos en cache para esta impresora.' });
    }
};

// Endpoint para obtener niveles de tóner precargados
precargarNivelesToner();
setInterval(precargarNivelesToner, 10 * 60 * 1000);





// export const getTonerScraping = async (req, res) => {
//     const ip = req.params.ip;
//     const url = `https://${ip}/sws/index.html`;

//     try {
//         const browser = await puppeteer.launch({ headless: true, args: ['--ignore-certificate-errors'] });
//         const page = await browser.newPage();
//         await page.goto(url, { waitUntil: 'networkidle2' });

//         // Espera a que aparezca algún elemento con la clase x-column
//         await page.waitForSelector('.x-column', { timeout: 10000 }).catch(() => {});

//         // Extrae todos los textos de los elementos .x-column que terminen en %
//         const niveles = await page.$$eval('.x-column', nodes =>
//             nodes
//                 .map(n => n.textContent.trim())
//                 .filter(t => /\d{1,3}%$/.test(t))
//         );

//         await browser.close();

//         if (niveles.length > 0) {
//             res.json({ ip, niveles });
//         } else {
//             res.status(404).json({ ip, error: 'No se encontró información del nivel de tóner.' });
//         }
//     } catch (error) {
//         res.status(500).json({ ip, error: error.message });
//     }
// };