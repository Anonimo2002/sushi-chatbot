const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  producto: {
    type: String,
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
  },
  precio: {
    type: Number,
    required: true,  // Asumimos que el precio es necesario
  },
});

const orderSchema = new mongoose.Schema({
  productos: [productSchema], // Un arreglo de productos
  estado: {
    type: String,
    default: 'pendiente', // Estado de la orden, por defecto es pendiente
  },
  totalAmount: {
    type: Number,
    required: true, // El monto total de la orden
  },
}, { timestamps: true });

const Pedido = mongoose.model('Pedido', orderSchema);

module.exports = Pedido;
