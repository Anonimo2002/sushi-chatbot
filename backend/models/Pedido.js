const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  producto: {
    type: String,
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
  },
  estado: {
    type: String,
    default: 'pendiente',
  },
}, { timestamps: true });

const Pedido = mongoose.model('Pedido', orderSchema);
module.exports = Pedido;
