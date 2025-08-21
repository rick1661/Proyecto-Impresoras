import {Router} from 'express';
import {getConsumibles} from '../controllers/consumibles.controllers.js';
import {getOneConsumible} from '../controllers/consumibles.controllers.js';
import {putOneConsumible} from '../controllers/consumibles.controllers.js';
import {deleteOneConsumible} from '../controllers/consumibles.controllers.js';

const router = Router();

// Consulta general
router.get('/consumible', getConsumibles );

//Consulta unica
router.get('/consumible/:id', getOneConsumible);

//Actualizando impresora
router.put('/consumible/:id', putOneConsumible );

// eliminacion de impresora
router.delete('/consumible/:id', deleteOneConsumible );

export default router;