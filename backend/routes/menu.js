const express = require('express');
const Producto = require('../models/producto');
const router = express.Router();

// Obtener el menú
router.get('/', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el menú' });
    }
});

module.exports = router;
