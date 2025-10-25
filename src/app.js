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
import http from 'http';
import path from 'path';
import snmp from 'net-snmp';
import rateLimit from 'express-rate-limit';

const __dirname = path.resolve();

// Función para cargar certificados SSL de forma segura
const loadSSLCertificates = () => {
  const keyPath = process.env.SSL_KEY_PATH || path.join(__dirname, 'certs', 'key.pem');
  const certPath = process.env.SSL_CERT_PATH || path.join(__dirname, 'certs', 'cert.pem');
  
  try {
    // Verificar que los archivos existen antes de leer
    if (!fs.existsSync(keyPath)) {
      throw new Error(`Archivo de clave SSL no encontrado: ${keyPath}`);
    }
    
    if (!fs.existsSync(certPath)) {
      throw new Error(`Archivo de certificado SSL no encontrado: ${certPath}`);
    }
    
    const key = fs.readFileSync(keyPath, 'utf8');
    const cert = fs.readFileSync(certPath, 'utf8');
    
    // Validación básica del contenido
    if (!key.includes('BEGIN PRIVATE KEY') && !key.includes('BEGIN RSA PRIVATE KEY')) {
      throw new Error('El archivo de clave no parece ser una clave privada válida');
    }
    
    if (!cert.includes('BEGIN CERTIFICATE')) {
      throw new Error('El archivo de certificado no parece ser un certificado válido');
    }
    
    console.log(`✅ Certificados SSL cargados exitosamente:`);
    console.log(`   Clave: ${keyPath}`);
    console.log(`   Certificado: ${certPath}`);
    
    return { key, cert };
    
  } catch (error) {
    console.error('❌ Error cargando certificados SSL:', error.message);
    
    // En desarrollo, sugerir solución
    if (process.env.NODE_ENV === 'development') {
      console.log('\n💡 Para generar certificados de desarrollo:');
      console.log('   openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes');
    }
    
    throw error; // Re-lanzar para que la app no inicie sin SSL
  }
};

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

// Configuración del servidor con manejo seguro de certificados
let server;
const PORT = process.env.PORT || 5500;

try {
  // Intentar cargar certificados SSL
  const sslOptions = loadSSLCertificates();
  
  // Crear servidor HTTPS con certificados válidos
  server = https.createServer(sslOptions, app);
  console.log(`🔒 Servidor configurado para HTTPS en puerto ${PORT}`);
  
} catch (error) {
  console.error('No se pudieron cargar certificados SSL:', error.message);
  
  // Fallback a HTTP solo en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️ Iniciando servidor HTTP (sin SSL) en modo desarrollo');
    server = http.createServer(app);
    console.log(`🌐 Servidor configurado para HTTP en puerto ${PORT}`);
  } else {
    console.error('❌ SSL es requerido en producción. La aplicación no puede iniciarse sin certificados válidos.');
    process.exit(1);
  }
}

// Iniciar el servidor
server.listen(PORT, () => {
  const protocol = server instanceof https.Server ? 'HTTPS' : 'HTTP';
  console.log(`🚀 Servidor ${protocol} escuchando en puerto ${PORT}`);
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔗 Accede a: ${protocol.toLowerCase()}://localhost:${PORT}`);
  }
});

// Manejo de cierre graceful
const gracefulShutdown = (signal) => {
  console.log(`\n📢 Recibida señal ${signal}. Cerrando servidor...`);
  
  server.close((err) => {
    if (err) {
      console.error('❌ Error al cerrar servidor:', err);
      process.exit(1);
    }
    
    console.log('✅ Servidor cerrado exitosamente');
    process.exit(0);
  });
  
  // Forzar cierre después de 10 segundos
  setTimeout(() => {
    console.error('❌ Forzando cierre del servidor');
    process.exit(1);
  }, 10000);
};

// Escuchar señales de cierre
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;