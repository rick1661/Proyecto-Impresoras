import {Router} from 'express';
import {getImpresoras} from '../controllers/impresora.controllers.js';
import {getOneImpresora} from '../controllers/impresora.controllers.js';
import {postOneImpresora} from '../controllers/impresora.controllers.js';
import {putOneImpresora} from '../controllers/impresora.controllers.js';
import {deleteOneImpresora} from '../controllers/impresora.controllers.js';

// Importar middleware y esquemas de validación
import { validateBody, validateParams } from '../middleware/validation.js';
import { 
    createImpresoraSchema, 
    updateImpresoraSchema, 
    impresoraParamsSchema 
} from '../middleware/schemas/impresora.schema.js';

const router = Router();

//Consulta general (sin validación - no tiene parámetros críticos)
router.get('/impresora/', getImpresoras );

//Consulta única (validar ID en parámetros)
router.get('/impresora/:id', 
    validateParams(impresoraParamsSchema),
    getOneImpresora 
);

//Creación (validar datos en body) - CORREGIDO: sin :id
router.post('/impresora', 
    validateBody(createImpresoraSchema),
    postOneImpresora
);

//Actualización (validar ID y datos)
router.put('/impresora/:id', 
    validateParams(impresoraParamsSchema),
    validateBody(updateImpresoraSchema),
    putOneImpresora 
);

//Eliminación (validar ID)
router.delete('/impresora/:id', 
    validateParams(impresoraParamsSchema),
    deleteOneImpresora 
);

export default router;