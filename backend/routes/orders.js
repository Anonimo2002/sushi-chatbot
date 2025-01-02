const express = require('express');
const Order = require('../models/Pedido'); 
const router = express.Router();

// Ruta para crear un pedido
router.post('/', async (req, res) => {
  const { productos } = req.body; // Ahora esperamos un arreglo de productos
  
  // Verificar que el arreglo de productos esté presente
  if (!productos || productos.length === 0) {
    return res.status(400).json({ message: 'Se requieren productos y cantidades' });
  }

  try {
    // Calcular el monto total del pedido
    const totalAmount = productos.reduce((total, product) => total + (product.cantidad * product.precio), 0);

    // Crear el nuevo pedido
    const nuevoPedido = new Order({
      productos,
      totalAmount,  // Agregar el total calculado
    });

    const savedOrder = await nuevoPedido.save();  // Guardar el pedido en la base de datos
    res.status(201).json(savedOrder);  // Devolver el pedido guardado como respuesta
  } catch (error) {
    console.error('Error al crear el pedido:', error);
    res.status(500).json({ message: 'Hubo un error al procesar el pedido', error });
  }
});

// Ruta para obtener todos los pedidos
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find(); // Obtener todos los pedidos
    res.json(orders);
  } catch (error) {
    console.error('Error al obtener los pedidos:', error);
    res.status(500).json({ message: 'Error al obtener los pedidos', error });
  }
});

module.exports = router;
