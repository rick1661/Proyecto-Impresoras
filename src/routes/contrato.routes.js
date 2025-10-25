import {Router} from 'express';
import {getContratos, getOneContrato, postOneContrato, putOneContrato, deleteOneContrato} from '../controllers/contrato.controllers.js';

// Importar middleware y esquemas de validación
import { validateBody, validateParams } from '../middleware/validation.js';
import { 
    createContratoSchema, 
    updateContratoSchema, 
    contratoParamsSchema 
} from '../middleware/schemas/contrato.schema.js';

const router = Router();

//Consulta general (sin validación - no tiene parámetros críticos)
router.get('/contrato', getContratos);

//Consulta única (validar ID en parámetros)
router.get('/contrato/:id', 
    validateParams(contratoParamsSchema),
    getOneContrato
);

//Creación (validar datos en body)
router.post('/contrato', 
    validateBody(createContratoSchema),
    postOneContrato
);

//Actualización (validar ID y datos)
router.put('/contrato/:id', 
    validateParams(contratoParamsSchema),
    validateBody(updateContratoSchema),
    putOneContrato
);

//Eliminación (validar ID)
router.delete('/contrato/:id', 
    validateParams(contratoParamsSchema),
    deleteOneContrato
);

export default router;