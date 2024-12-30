const mongoose = require('mongoose');

const PedidoSchema = new mongoose.Schema({
    usuario: { type: String, required: true },
    productos: [
        {
            producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
            cantidad: { type: Number, required: true },
        },
    ],
    estado: { type: String, default: 'Pendiente' }, // Pendiente, En preparación, Enviado
    fecha: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Pedido', PedidoSchema);
