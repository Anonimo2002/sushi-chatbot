// backend/routes/menu.js
const express = require('express');
const Producto = require('../models/producto');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener el menú:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;