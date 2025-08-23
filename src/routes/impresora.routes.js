import {Router} from 'express';
import {getImpresoras} from '../controllers/impresora.controllers.js';
import {getOneImpresora} from '../controllers/impresora.controllers.js';
import {postOneImpresora} from '../controllers/impresora.controllers.js';
import {putOneImpresora} from '../controllers/impresora.controllers.js';
import {deleteOneImpresora} from '../controllers/impresora.controllers.js';

const router = Router();

// Consulta general
router.get('/impresora', getImpresoras);

//Consulta unica
router.get('/impresora/:id', getOneImpresora );

//Creando impresora
router.post('/impresora/:id', postOneImpresora);

//Actualizando impresora
router.put('/impresora/:id', putOneImpresora );

// eliminacion de impresora
router.delete('/impresora/:id', deleteOneImpresora );

export default router;