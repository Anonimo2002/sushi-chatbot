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
app.post('/order', async (req, res) => {
  const { productName, quantity } = req.body;
  try {
    // Buscar el producto por nombre
    const producto = await Producto.findOne({ name: productName });

    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Crear un nuevo pedido
    const newOrder = new Pedido({
      productName,
      quantity,
      totalPrice: producto.price * quantity,  // Calcula el precio total
    });

    // Guardar el pedido en la base de datos
    await newOrder.save();

    res.status(200).json({ message: 'Pedido confirmado', order: newOrder });
  } catch (error) {
    console.error('Error al realizar el pedido:', error);
    res.status(500).json({ message: 'Error al procesar el pedido', error });
  }
});

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
app.use('/orders', ordersRoutes);  // La ruta para los pedidos

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
