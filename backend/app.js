const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const app = express();
const Producto = require('./models/producto');

// Middleware
app.use(express.json());
app.use(cors());

// Conectar a MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/sushi-chatbot';
mongoose
  .connect(mongoURI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch((error) => console.error('Error al conectar a MongoDB:', error));

  // Ruta para la raíz ("/")
app.get('/', (req, res) => {
    res.send('¡Bienvenido al Sushi Chatbot!');
  });

  // Ruta para obtener los productos
app.get('/productos', async (req, res) => {
    try {
      const productos = await Producto.find();  // Obtiene todos los productos de la base de datos
      res.json(productos);  // Devuelve los productos como respuesta JSON
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los productos', error });
    }
  });
// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
