import {Router} from 'express';
import {getAreas, getOneArea, postOneArea, putOneArea, deleteOneArea} from '../controllers/area.controllers.js';

// Importar middleware y esquemas de validación
import { validateBody, validateParams } from '../middleware/validation.js';
import { 
    createAreaSchema, 
    updateAreaSchema, 
    areaParamsSchema 
} from '../middleware/schemas/area.schema.js';

const router = Router();

// Consulta general (sin validación - no tiene parámetros críticos)
router.get('/area', getAreas);

// Consulta única (validar ID en parámetros)
router.get('/area/:id', 
    validateParams(areaParamsSchema),
    getOneArea
);

// Creación (validar datos en body)
router.post('/area', 
    validateBody(createAreaSchema),
    postOneArea
);

// Actualización (validar ID y datos)
router.put('/area/:id', 
    validateParams(areaParamsSchema),
    validateBody(updateAreaSchema),
    putOneArea
);

// Eliminación (validar ID)
router.delete('/area/:id', 
    validateParams(areaParamsSchema),
    deleteOneArea
);

export default router;