const express = require('express');
const Order = require('../models/Pedido'); // Asegúrate de que el modelo de pedido esté importado
const router = express.Router();

// Ruta para crear un pedido
router.post('/', async (req, res) => {
    const { productName, quantity } = req.body; // Captura el nombre del cliente
  
    // Verificar que todos los campos estén presentes
    if (!productName || !quantity ) {
      return res.status(400).json({ message: 'Producto y cantidad son requeridos' });
    }
  
    try {
      // Crear el nuevo pedido, asegurándose de que el nombre del cliente esté incluido
      const nuevoPedido = new Order({
        producto: productName,
        cantidad: quantity,
        estado: 'pendiente',  // Estado por defecto
       
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
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error('Error al obtener los pedidos:', error);
    res.status(500).json({ message: 'Error al obtener los pedidos', error });
  }
});



module.exports = router;
