const mongoose = require('mongoose');

// Define el esquema para los productos
const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true }
});

// Crea el modelo basado en el esquema
const Producto = mongoose.model('Producto', productoSchema, 'products');


module.exports = Producto;
