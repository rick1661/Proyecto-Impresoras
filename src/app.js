
import express from 'express';
import cors from 'cors'
import impresoraRoutes from './routes/impresora.routes.js'; 
import empresaRoutes from './routes/empresa.routes.js';
import contratoRoutes from './routes/contrato.routes.js';
import consumibleRoutes from './routes/consumible.routes.js';
import areaRoutes from './routes/area.routes.js';



// crear la instancia de la applicacion Express
const app = express();
app.use(cors()) //Habilitar CORS
app.use(express.json()); //Habilitar el parseo de JSON
app.use(express.urlencoded({ extended: true })); // Para formularios (opcional)


const corsOptions = {
  origin: 'http://192.168.80.9:5500' // Reemplaza con tu origen del frontend
};
app.use(cors(corsOptions));


const PORT = 5000; // Puerto de tu servidor Node.js
  app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

//Uso de rutas
app.use(impresoraRoutes);
app.use(empresaRoutes);
app.use(contratoRoutes);
app.use(consumibleRoutes);
app.use(areaRoutes);

export default app;