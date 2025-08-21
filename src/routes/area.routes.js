import {Router} from 'express';

const router = Router();

// Consulta general
router.get('/area', (req, res) => {
    res.send('Obteniendo areas');
});

//Consulta unica
router.get('/area/:id', (req, res) => {
    res.send('Obteniendo una sola area');
});

//Actualizando impresora
router.put('/area/:id', (req, res) => {
    res.send('Actualizando area');
});

// eliminacion de impresora
router.delete('/area/:id', (req, res) =>{
    res.send('Eliminado area');
});

export default router;