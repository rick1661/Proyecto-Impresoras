import express from 'express';
import cors from 'cors'
import helmet from 'helmet';
import compression from 'compression';
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
      'http://localhost:5501',
      'http://localhost:5502',
      'http://localhost:5503',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5500',
      'https://localhost:5500',
      'https://localhost:5501',
      'https://localhost:5502',
      'https://localhost:5503'
    ],
    testing: [
      // VLAN principal 192.168.85.x (equipos e impresoras)
      'https://192.168.85.1:5500',
      'https://192.168.85.10:5500',
      'https://192.168.85.100:5500',
      // VLAN administrativa 192.168.80.x (estaciones de trabajo)
      'https://192.168.80.1:5500',
      'https://192.168.80.10:5500',
      'https://192.168.80.50:5500',
      'https://192.168.80.100:5500',
      'https://192.168.80.180:5500',
      'https://192.168.80.181:5500'
    ],
    production: [
      // Dominio interno del hospital
      'https://simnsa.local',
      'https://impresoras.simnsa.local',
      'https://api-impresoras.simnsa.local',
      // VLAN de equipos médicos 192.168.85.x
      'https://192.168.85.1',
      'https://192.168.85.10',
      'https://192.168.85.100',
      // VLAN administrativa 192.168.80.x  
      'https://192.168.80.1',
      'https://192.168.80.10',
      'https://192.168.80.50',
      'https://192.168.80.100'
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

// ============================================================================
// 🔒 CONFIGURACIÓN DE SEGURIDAD PARA ENTORNO HOSPITALARIO
// ============================================================================

// 1. Helmet - Headers de seguridad HTTP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: [
        "'self'", 
        "'unsafe-inline'", // Necesario para algunos estilos inline
        "cdnjs.cloudflare.com",
        "fonts.googleapis.com",
        "cdn.jsdelivr.net"
      ],
      fontSrc: [
        "'self'",
        "fonts.gstatic.com",
        "cdnjs.cloudflare.com"
      ],
      scriptSrc: [
        "'self'",
        "cdn.jsdelivr.net",
        "cdnjs.cloudflare.com",
        "code.jquery.com" // Para jQuery oficial
      ],
      imgSrc: [
        "'self'",
        "data:", // Para imágenes base64
        "blob:" // Para imágenes generadas dinámicamente
      ],
      connectSrc: [
        "'self'",
        "https:", // Permitir HTTPS en general para consultas SNMP
        "http:", // Permitir HTTP para equipos internos si es necesario
        "ws:", // WebSockets
        "wss:" // WebSockets seguros
      ]
    }
  },
  crossOriginEmbedderPolicy: false, // Permitir recursos de terceros necesarios
  hsts: {
    maxAge: 31536000, // 1 año
    includeSubDomains: true,
    preload: true
  }
}));

// 2. Compresión GZIP para optimizar transferencia de datos
app.use(compression({
  filter: (req, res) => {
    // No comprimir si el cliente explícitamente no lo quiere
    if (req.headers['x-no-compression']) {
      return false;
    }
    // Usar filtro por defecto para otros casos
    return compression.filter(req, res);
  },
  level: 6, // Nivel balanceado de compresión (1-9)
  threshold: 1024 // Solo comprimir respuestas > 1KB
}));

// 3. Rate Limiting diferenciado por tipo de operación
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 50000, // 🏥 Límite muy alto para uso hospitalario intensivo (55 req/seg promedio)
  message: {
    error: 'Demasiadas peticiones desde esta IP',
    retryAfter: '15 minutos'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip en desarrollo y para IPs locales del hospital
  skip: (req) => {
    return process.env.NODE_ENV === 'development' || 
           req.ip === '::1' || 
           req.ip === '127.0.0.1' ||
           req.ip?.startsWith('192.168.85.') ||
           req.ip?.startsWith('192.168.80.');
  }
});

const tonerLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 🔧 10 minutos (duplicado)
  max: 2000, // 🔧 2000 consultas cada 10 min (3.3/seg) - mucho más permisivo
  message: {
    error: 'Límite de consultas de tóner excedido',
    retryAfter: '10 minutos'
  },
  // Bypass para desarrollo y redes del hospital
  skip: (req) => {
    return process.env.NODE_ENV === 'development' || 
           req.ip === '::1' || 
           req.ip === '127.0.0.1' ||
           req.ip?.startsWith('192.168.85.') ||
           req.ip?.startsWith('192.168.80.');
  }
});

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5000, // 🔧 10x más permisivo para operaciones administrativas
  message: {
    error: 'Límite excedido para operaciones administrativas',
    retryAfter: '15 minutos'
  },
  // Bypass para desarrollo y redes del hospital  
  skip: (req) => {
    return process.env.NODE_ENV === 'development' || 
           req.ip === '::1' || 
           req.ip === '127.0.0.1' ||
           req.ip?.startsWith('192.168.85.') ||
           req.ip?.startsWith('192.168.80.');
  }
});

// Aplicar limitadores globales
app.use('/api/', generalLimiter);

// ============================================================================

app.use(express.json()); //Habilitar el parseo de JSON
app.use(express.urlencoded({ extended: true })); // Para formularios (opcional)



// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Ruta base: redirige al index.html si acceden a /
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


//Uso de rutas con rate limiting específico por tipo de operación

// Rutas administrativas (más restrictivas)
app.use('/api', adminLimiter, impresoraRoutes);
app.use('/api', adminLimiter, empresaRoutes);
app.use('/api', adminLimiter, contratoRoutes);
app.use('/api', adminLimiter, consumibleRoutes);
app.use('/api', adminLimiter, areaRoutes);

// Rutas de tóner (limitación especial para proteger equipos)
app.use('/api', tonerLimiter, tonerRoutes);

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