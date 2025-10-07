
import express from 'express';
import cors from 'cors'
import impresoraRoutes from './routes/impresora.routes.js'; 
import empresaRoutes from './routes/empresa.routes.js';
import contratoRoutes from './routes/contrato.routes.js';
import consumibleRoutes from './routes/consumible.routes.js';
import areaRoutes from './routes/area.routes.js';
import tonerRoutes from './routes/toner.routes.js';

import fs from 'fs';
import https from 'https';
import path from 'path';
import snmp from 'net-snmp';

const __dirname = path.resolve();

// crear la instancia de la applicacion Express
const app = express();

const corsOptions = {
  origin: 'https://192.168.80.180:5500', // Reemplaza con tu origen del frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
};
app.use(cors(corsOptions)); //Habilitar CORS


app.use(express.json()); //Habilitar el parseo de JSON
app.use(express.urlencoded({ extended: true })); // Para formularios (opcional)



// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Ruta base: redirige al index.html si acceden a /
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


//Uso de rutas
app.use(impresoraRoutes);
app.use(empresaRoutes);
app.use(contratoRoutes);
app.use(consumibleRoutes);
app.use(areaRoutes);
app.use(tonerRoutes);



// Leer los certificados
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'certs', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'certs', 'cert.pem')),
};

// Crear servidor HTTPS
const PORT = 5500;

https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`Servidor HTTPS escuchando en el puerto ${PORT}`);
});

export default app;