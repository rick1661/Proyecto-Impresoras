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
import rateLimit from 'express-rate-limit';

const __dirname = path.resolve();

// crear la instancia de la applicacion Express
const app = express();

// Configuración CORS dinámica desde variables de entorno
const getAllowedOrigins = () => {
  const envOrigins = process.env.CORS_ORIGINS;
  
  if (envOrigins) {
    // Si hay orígenes en .env, convertir string a array
    return envOrigins.split(',').map(origin => origin.trim());
  }
  
  // Fallback: orígenes por defecto según el entorno
  const defaultOrigins = {
    development: [
      'http://localhost:3000',
      'http://localhost:5500',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5500'
    ],
    testing: [
      'https://192.168.80.180:5500',
      'https://192.168.80.181:5500'
    ],
    production: [
      'https://api-impresoras.empresa.com',
      'https://impresoras.empresa.com'
    ]
  };
  
  const env = process.env.NODE_ENV || 'development';
  return defaultOrigins[env] || defaultOrigins.development;
};

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = getAllowedOrigins();
    
    // Permitir requests sin origin (como Postman, aplicaciones móviles)
    if (!origin) {
      console.log('🔓 CORS: Permitiendo request sin origin (Postman, mobile, etc.)');
      return callback(null, true);
    }
    
    // Verificar si el origin está en la lista permitida
    if (allowedOrigins.includes(origin)) {
      console.log(`✅ CORS: Permitiendo origin ${origin}`);
      return callback(null, true);
    }
    
    // En desarrollo, ser más permisivo
    if (process.env.NODE_ENV === 'development') {
      console.log(`⚠️ CORS: Permitiendo ${origin} (modo desarrollo)`);
      return callback(null, true);
    }
    
    // Rechazar origins no autorizados
    console.error(`❌ CORS: Rechazando origin no autorizado: ${origin}`);
    const msg = `CORS policy: Origin ${origin} no está permitido por política CORS`;
    return callback(new Error(msg), false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200
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