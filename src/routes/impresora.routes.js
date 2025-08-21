import {Router} from 'express';
import {getImpresoras} from '../controllers/impresora.controllers.js';
import {getOneImpresora} from '../controllers/impresora.controllers.js';
import {putOneimpresora} from '../controllers/impresora.controllers.js';
import {deleteOneimpresora} from '../controllers/impresora.controllers.js';

const router = Router();

// Consulta general
router.get('/impresora', getImpresoras);

//Consulta unica
router.get('/impresora/:serie', getOneImpresora );

//Actualizando impresora
router.put('/impresora/:serie', putOneimpresora );

// eliminacion de impresora
router.delete('/impresora/:serie', deleteOneimpresora );

export default router;