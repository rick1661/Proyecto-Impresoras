import express from 'express';
import impresoraRoutes from './routes/impresora.routes.js'; 
import empresaRoutes from './routes/empresa.routes.js';


// crear la instancia de la applicacion Express
const app = express()

//Uso de rutas
app.use(impresoraRoutes);
app.use(empresaRoutes);

export default app