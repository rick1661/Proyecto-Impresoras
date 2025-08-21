import {Router} from 'express';

const router = Router();

//Consulta general
router.get('/contrato', (req, res) => {
    res.send('Obteniendo contratos');
});

//Consulta unica
router.get('/contrato/:id', (req, res) => {
    res.send('Obteniendo una sola consulta');
});

//Actualizacion unica
router.put('/contrato/:id', (req, res) =>{
    res.send('Actualizando contrato');
});

//Eliminacion unica
router.put('/contrato/:id', (req, res) =>{
    res.send('Eliminando contrato');
});

export default router;