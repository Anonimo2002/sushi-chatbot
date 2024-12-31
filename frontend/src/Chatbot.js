import React, { useState, useEffect } from 'react';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [ordering, setOrdering] = useState(false);
  const [orderDetails, setOrderDetails] = useState({ productName: '', quantity: 1 });
  const [productos, setProductos] = useState([]); // Para almacenar los productos

  useEffect(() => {
    setMessages([
      { text: '¡Hola! Soy el bot de Sushi. ¿Cómo puedo ayudarte hoy?', sender: 'bot' },
    ]);
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await fetch('/productos');
      const data = await response.json();
      setProductos(data); // Guardar productos

      // Mostrar el menú al usuario
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'Menú de Sushi:', sender: 'bot' },
      ]);
      data.forEach((producto) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: `${producto.name}: $${producto.price} - ${producto.description}`,
            sender: 'bot',
          },
        ]);
      });
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'Hubo un error al cargar el menú. Inténtalo nuevamente más tarde.', sender: 'bot' },
      ]);
    }
  };

  const handleUserMessage = (e) => {
    setUserMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (userMessage.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: userMessage, sender: 'user' },
      ]);
      setUserMessage('');
      processBotResponse(userMessage);
    }
  };

  const processBotResponse = (message) => {
    const lowerMessage = message.toLowerCase();

    // Palabras clave para el horario
    const horarioKeywords = ['abren', 'abiertos', 'servicio', 'horario', 'horarios', 'tiempo', 'hora', 'días'];
    // Palabras clave para el menú
    const menuKeywords = ['menu', 'carta', 'piezas', 'platillos', 'sushi', 'productos', 'opciones'];
    // Palabras clave para el pedido
    const orderKeywords = ['pedido', 'ordenar', 'pedir', 'comprar', 'reservar', 'solicitar'];

    let botMessage = 'Lo siento, no entendí eso.';

    if (horarioKeywords.some((word) => lowerMessage.includes(word))) {
      botMessage = 'Estamos abiertos todos los días de 14:00 a 00:00.';
    } else if (menuKeywords.some((word) => lowerMessage.includes(word))) {
      botMessage = '¡Claro! Aquí está nuestro menú:';
      fetchProductos(); // Cargar y mostrar el menú
    } else if (orderKeywords.some((word) => lowerMessage.includes(word))) {
      botMessage = '¡Perfecto! ¿Qué producto te gustaría ordenar?';
      setOrdering(true);
    } else if (lowerMessage.includes('sushi')) {
      botMessage = '¡Me encanta el sushi! ¿Qué tipo de sushi prefieres?';
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: botMessage, sender: 'bot' },
    ]);
  };

  const handleOrderChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails((prevOrderDetails) => ({
      ...prevOrderDetails,
      [name]: value,
    }));
  };

  const handleOrder = async () => {
    const { productName, quantity } = orderDetails;
    const selectedProduct = productos.find((p) => p.name.toLowerCase() === productName.toLowerCase());

    if (!selectedProduct) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'Producto no encontrado. Por favor, elige uno del menú.', sender: 'bot' },
      ]);
      return;
    }

    const total = selectedProduct.price * quantity;

    await fetch('/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productName, quantity }),
    });

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        text: `Tu pedido de ${quantity} ${productName} ha sido recibido. Total: $${total.toFixed(2)}.`,
        sender: 'bot',
      },
    ]);

    setOrdering(false);
    setOrderDetails({ productName: '', quantity: 1 });
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>Chatbot de Sushi</h2>
      </div>
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender}>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <div className="chatbot-input">
        {ordering ? (
          <div>
            <label>
              Producto:
              <input
                type="text"
                name="productName"
                value={orderDetails.productName}
                onChange={handleOrderChange}
                placeholder="Ej. Sushi de atún"
              />
            </label>
            <label>
              Cantidad:
              <input
                type="number"
                name="quantity"
                value={orderDetails.quantity}
                onChange={handleOrderChange}
                min="1"
              />
            </label>
            <button onClick={handleOrder}>Confirmar pedido</button>
          </div>
        ) : (
          <div>
            <input
              type="text"
              value={userMessage}
              onChange={handleUserMessage}
              placeholder="Escribe tu mensaje"
            />
            <button onClick={handleSendMessage}>Enviar</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
