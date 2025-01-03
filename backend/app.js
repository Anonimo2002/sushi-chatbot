const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const app = express();
const Producto = require('./models/producto');
const Pedido = require('./models/Pedido');  // Asegúrate de que este modelo esté correctamente configurado
const ordersRoutes = require('./routes/orders'); ;  // Ruta de pedidos

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

// Ruta para recibir los pedidos del chatbot
app.use('/orders', ordersRoutes);  // La ruta para los pedidos


// Ruta de prueba del chatbot
app.post('/chat', (req, res) => {
  const userMessage = req.body.message;
  console.log('Mensaje del usuario:', userMessage);
  
  // Lógica simple para devolver una respuesta
  let botResponse = "Hola, ¿cómo puedo ayudarte?";
  
  if (userMessage.toLowerCase().includes('sushi')) {
    botResponse = "¡Me encanta el sushi! ¿Qué tipo de sushi prefieres?";
  }

  res.json({ message: botResponse });
});

// Usar las rutas de pedidos


// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
