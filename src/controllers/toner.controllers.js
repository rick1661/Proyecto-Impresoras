import snmp from 'net-snmp';
import puppeteer from 'puppeteer';
import { impresoraIpModelo } from './impresora.controllers.js';

const tonerCacheColor = {}; // Caché en memoria para niveles de tóner
const tonerCacheScraping = {}; // Caché en memoria para niveles de tóner
const tonerCacheNegro = {}; // Caché en memoria para niveles de tóner

const modelosColor = [
    'E47528',
    'P57750 XC',
    'MFP M283fdw',
    'MFP P57750'
];

const modelosScraping = [
    "408dn",
    "MFP M232",
    "MFP 432",
    "M432"
];

// Función para precargar niveles de tóner en caché
async function precargarNivelesToner() {
    const impresoras = await impresoraIpModelo();
    impresoras.forEach(element => {
        if (modelosColor.includes(element.modelo)) {

            tonerCacheColor = obtenerNivelesTonerColor(element.direccionIp);

        } else if (modelosScraping.includes(element.modelo)) {

            tonerCacheScraping = obtenerNivelesTonerScraping(element.direccionIp);
        }
        else {
            tonerCacheNegro = obtenerNivelesTonerNegro(element.direccionIp);
        }
    }); // <-- Add this closing parenthesis for forEach

}

function obtenerNivelesTonerNegro(ip) {
    return new Promise((resolve, reject) => {
        const community = 'public';
        const oidNegro = '1.3.6.1.2.1.43.11.1.1.9.1.1'; // OID de tóner negro
        const session = snmp.createSession(ip, community);

        session.get([oidNegro], (error, varbinds) => {
            if (error) {
                console.error('Error SNMP:', error);
                reject(error);
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
        // OIDs estándar para negro, cyan, magenta, amarillo
        const oids = [
            { color: 'black', oid: '1.3.6.1.2.1.43.11.1.1.9.1.1' },
            { color: 'cyan', oid: '1.3.6.1.2.1.43.11.1.1.9.1.2' },
            { color: 'magenta', oid: '1.3.6.1.2.1.43.11.1.1.9.1.3' },
            { color: 'yellow', oid: '1.3.6.1.2.1.43.11.1.1.9.1.4' }
        ];
        const session = snmp.createSession(ip, community);

        session.get(oids.map(o => o.oid), (error, varbinds) => {
            if (error) {
                console.error('Error SNMP:', error);
                reject(error);
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
    return new Promise((resolve, reject) => {
        const url = `https://${ip}/sws/index.html`;
        let browser;
        puppeteer.launch({ headless: true, args: ['--ignore-certificate-errors'] })
            .then(b => {
                browser = b;
                return browser.newPage();
            })
            .then(page => {
                // Bloquear la carga de imágenes, CSS, fuentes y scripts para acelerar el scraping
                page.setRequestInterception(true);
                page.on('request', (req) => {
                    const blockedTypes = ['image', 'stylesheet', 'font', 'script'];
                    if (blockedTypes.includes(req.resourceType())) {
                        req.abort();
                    } else {
                        req.continue();
                    }
                });
                return page.goto(url, { waitUntil: 'networkidle2' });
            })
            .then(page => {
                // Espera a que aparezca algún elemento con la clase x-column
                return page.waitForSelector('.x-column', { timeout: 10000 });
            })
            .then(() => {
                // Extrae todos los textos de los elementos .x-column que terminen en %
                return page.$$eval('.x-column', nodes =>
                    nodes
                        .map(n => n.textContent.trim())
                        .filter(t => /\d{1,3}%$/.test(t))
                );
            })
            .then(niveles => {
                if (niveles.length > 0) {
                    resolve({ ip, niveles });
                } else {
                    reject(new Error('No se encontraron niveles de tóner'));
                }
            })
            .catch(error => {
                console.error('Error en el scraping:', error);
                reject(error);
            })
            .finally(() => {
                if (browser) {
                    browser.close();
                }
            });
    });
}

export const getTonerNegro = async (req, res) => {
    const ip = req.params.ip;
    console.log(`Conectando a la impresora con IP: ${ip}`);
    const community = 'public';
    const oidNegro = '1.3.6.1.2.1.43.11.1.1.9.1.1'; // OID de tóner negro
    const session = snmp.createSession(ip, community);

    session.get([oidNegro], (error, varbinds) => {
        if (error) {
            console.error('Error SNMP:', error);
            res.status(500).json({ error: 'Error al consultar la impresora' });
        } else {
            const tonerLevel = varbinds[0]?.value;
            res.json({ ip, tonerLevel });
        }
        session.close();
    });
}

export const getTonersColor = async (req, res) => {
    const ip = req.params.ip;
    console.log(`Conectando a la impresora con IP: ${ip}`);
    const community = 'public';
    // OIDs estándar para negro, cyan, magenta, amarillo
    const oids = [
        { color: 'black', oid: '1.3.6.1.2.1.43.11.1.1.9.1.1' },
        { color: 'cyan', oid: '1.3.6.1.2.1.43.11.1.1.9.1.2' },
        { color: 'magenta', oid: '1.3.6.1.2.1.43.11.1.1.9.1.3' },
        { color: 'yellow', oid: '1.3.6.1.2.1.43.11.1.1.9.1.4' }
    ];
    const session = snmp.createSession(ip, community);

    session.get(oids.map(o => o.oid), (error, varbinds) => {
        if (error) {
            console.error('Error SNMP:', error);
            res.status(500).json({ error: 'Error al consultar la impresora' });
        } else {
            const tonerLevels = {};
            oids.forEach((o, i) => {
                tonerLevels[o.color] = varbinds[i]?.value ?? null;
            });
            res.json({ ip, tonerLevels });
        }
        session.close();
    });
};


export const getTonerScraping = async (req, res) => {
    const ip = req.params.ip;
    const datos = tonerCacheScraping[ip];
    if (datos) {
        // Devuelve ambos valores
        res.json({ ip, black: datos.black, image: datos.image });
    } else {
        res.status(404).json({ ip, error: 'No hay datos en cache para esta impresora.' });
    }
};

// Endpoint para obtener niveles de tóner precargados
setInterval(precargarNivelesToner, 5 * 60 * 1000);