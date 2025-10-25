import {Router} from 'express';
import {getEmpresas, getOneEmpresa, postOneEmpresa, putOneEmpresa, deleteOneEmpresa} from '../controllers/empresa.controllers.js';

// Importar middleware y esquemas de validación
import { validateBody, validateParams } from '../middleware/validation.js';
import { 
    createEmpresaSchema, 
    updateEmpresaSchema, 
    empresaParamsSchema 
} from '../middleware/schemas/empresa.schema.js';

const router = Router();

// Consulta general (sin validación - no tiene parámetros críticos)
router.get('/empresa', getEmpresas);

//Consulta única (validar ID en parámetros)
router.get('/empresa/:id', 
    validateParams(empresaParamsSchema),
    getOneEmpresa
);

//Creación (validar datos en body)
router.post('/empresa', 
    validateBody(createEmpresaSchema),
    postOneEmpresa
);

//Actualización (validar ID y datos)
router.put('/empresa/:id', 
    validateParams(empresaParamsSchema),
    validateBody(updateEmpresaSchema),
    putOneEmpresa
);

//Eliminación (validar ID)
router.delete('/empresa/:id', 
    validateParams(empresaParamsSchema),
    deleteOneEmpresa
);

export default router;

