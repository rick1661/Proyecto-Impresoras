import {Router} from 'express';
import {getImpresoras} from '../controllers/impresora.controllers.js';
import {getOneImpresora} from '../controllers/impresora.controllers.js';
import {postOneImpresora} from '../controllers/impresora.controllers.js';
import {putOneimpresora} from '../controllers/impresora.controllers.js';
import {deleteOneimpresora} from '../controllers/impresora.controllers.js';

const router = Router();

// Consulta general
router.get('/impresora', getImpresoras);

//Consulta unica
router.get('/impresora/:id', getOneImpresora );

//Creando impresora
router.post('/impresora/:id', postOneImpresora);

//Actualizando impresora
router.put('/impresora/:id', putOneimpresora );

// eliminacion de impresora
router.delete('/impresora/:id', deleteOneimpresora );

export default router;