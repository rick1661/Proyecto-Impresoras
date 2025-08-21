import {Router} from 'express';
import {getAreas} from '../controllers/area.controllers.js';
import {getOneArea} from '../controllers/area.controllers.js';
import { postOneArea } from '../controllers/area.controllers.js';
import {putOneArea} from '../controllers/area.controllers.js';
import {deleteOneArea} from '../controllers/area.controllers.js';

const router = Router();

// Consulta general
router.get('/area', getAreas);

//Consulta unica
router.get('/area/:id', getOneArea );

//Creacion unica
router.get('/area/:id', postOneArea);

//Actualizando impresora
router.put('/area/:id', putOneArea );

// eliminacion de impresora
router.delete('/area/:id', deleteOneArea);

export default router;