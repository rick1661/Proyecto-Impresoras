import express from 'express';
import impresoraRoutes from './routes/impresora.routes.js'; 
import empresaRoutes from './routes/empresa.routes.js';
import contratoRoutes from './routes/contrato.routes.js';
import consumibleRoutes from './routes/contrato.routes.js';
import areaRoutes from './routes/area.routes.js';




// crear la instancia de la applicacion Express
const app = express()

//Uso de rutas
app.use(impresoraRoutes);
app.use(empresaRoutes);
app.use(contratoRoutes);
app.use(consumibleRoutes);
app.use(areaRoutes);

export default app;