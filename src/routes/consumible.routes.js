import {Router} from 'express';
import {getConsumibles} from '../controllers/consumible.controllers.js';
import {getOneConsumible} from '../controllers/consumible.controllers.js';
import {postOneConsumible} from '../controllers/consumible.controllers.js';
import {putOneConsumible} from '../controllers/consumible.controllers.js';
import {deleteOneConsumible} from '../controllers/consumible.controllers.js';

// Importar middleware y esquemas de validación
import { validateBody, validateParams } from '../middleware/validation.js';
import { 
    createConsumibleSchema, 
    updateConsumibleSchema, 
    consumibleParamsSchema,
    consumibleSerieParamsSchema 
} from '../middleware/schemas/consumible.schema.js';

const router = Router();

// Consulta general (sin validación - no tiene parámetros críticos)
router.get('/consumible', getConsumibles );

//Consulta única por ID o serie (validar parámetro)
// Nota: Este endpoint puede recibir tanto ID numérico como serie alfanumérica
router.get('/consumible/:id', 
    // Usamos un middleware personalizado que valida ambos casos
    (req, res, next) => {
        // Si el parámetro es numérico, validar como ID
        if (/^\d+$/.test(req.params.id)) {
            return validateParams(consumibleParamsSchema)(req, res, next);
        } else {
            // Si es alfanumérico, validar como serie
            return validateParams(consumibleSerieParamsSchema)(req, res, next);
        }
    },
    getOneConsumible
);

//Creación (validar datos en body) - CORREGIDO: sin :id
router.post('/consumible', 
    validateBody(createConsumibleSchema),
    postOneConsumible
);

//Actualización (validar ID y datos)
router.put('/consumible/:id', 
    validateParams(consumibleParamsSchema),
    validateBody(updateConsumibleSchema),
    putOneConsumible 
);

//Eliminación (validar ID)
router.delete('/consumible/:id', 
    validateParams(consumibleParamsSchema),
    deleteOneConsumible 
);

export default router;