const express = require('express');
const router = express.Router();
const Order = require('../models/Pedido'); // Asegúrate de que la ruta al modelo de Order es correcta

// Ruta para crear un nuevo pedido
router.post('/', async (req, res) => {
    try {
      const { productName, quantity } = req.body; // Obtener los datos del pedido
  
      if (!productName || !quantity) {
        return res.status(400).json({ message: 'Producto y cantidad son requeridos' });
      }
  
      const nuevoPedido = new Order({
        producto: productName, // Cambiar al formato esperado por la base de datos
        cantidad: quantity,
        estado: 'pendiente',
      });
  
      const savedOrder = await nuevoPedido.save(); // Guardar el pedido en la base de datos
      res.status(201).json(savedOrder); // Devolver el pedido guardado como respuesta
    } catch (error) {
      console.error('Error al crear el pedido:', error);
      res.status(500).json({ message: 'Hubo un error al procesar el pedido', error });
    }
  });
  

// Ruta para obtener todos los pedidos (opcional)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find(); // Obtener todos los pedidos
    res.json(orders); // Devolver los pedidos
  } catch (error) {
    console.error('Error al obtener los pedidos:', error);
    res.status(500).json({ message: 'Error al obtener los pedidos', error });
  }
});

module.exports = router;
