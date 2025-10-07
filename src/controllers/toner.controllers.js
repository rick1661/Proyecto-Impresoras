import snmp from 'net-snmp';
import puppeteer from 'puppeteer';


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
    const url = `https://${ip}/sws/index.html`;

    try {
        const browser = await puppeteer.launch({ headless: true, args: ['--ignore-certificate-errors'] });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Espera a que aparezca algún elemento con la clase x-column
        await page.waitForSelector('.x-column', { timeout: 10000 }).catch(() => {});

        // Extrae todos los textos de los elementos .x-column que terminen en %
        const niveles = await page.$$eval('.x-column', nodes =>
            nodes
                .map(n => n.textContent.trim())
                .filter(t => /\d{1,3}%$/.test(t))
        );

        await browser.close();

        if (niveles.length > 0) {
            res.json({ ip, niveles });
        } else {
            res.status(404).json({ ip, error: 'No se encontró información del nivel de tóner.' });
        }
    } catch (error) {
        res.status(500).json({ ip, error: error.message });
    }
};