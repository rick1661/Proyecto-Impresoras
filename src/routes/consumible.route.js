import {Router} from 'express';

const router = Router();

// Consulta general
router.get('/consumible', (req, res) => {
    res.send('Obteniendo consumibles');
});

//Consulta unica
router.get('/consumible/:id', (req, res) => {
    res.send('Obteniendo una sola consulta');
});

//Actualizando impresora
router.put('/consumible/:id', (req, res) => {
    res.send('Actualizando consumible');
});

// eliminacion de impresora
router.delete('/consumible/:id', (req, res) =>{
    res.send('Eliminado consumible');
});

export default router;