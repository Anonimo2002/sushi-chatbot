const express = require('express');
const Pedido = require('../models/Pedido');
const router = express.Router();

// Crear un nuevo pedido
router.post('/', async (req, res) => {
    const { usuario, productos } = req.body;
    try {
        const nuevoPedido = new Pedido({ usuario, productos });
        await nuevoPedido.save();
        res.status(201).json(nuevoPedido);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el pedido' });
    }
});

// Consultar estado de un pedido
router.get('/:id', async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id).populate('productos.producto');
        if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
        res.json(pedido);
    } catch (error) {
        res.status(500).json({ error: 'Error al consultar el pedido' });
    }
});

module.exports = router;
