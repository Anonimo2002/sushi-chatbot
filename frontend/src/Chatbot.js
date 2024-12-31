import React, { useState, useEffect } from 'react';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [ordering, setOrdering] = useState(false);
  const [orderDetails, setOrderDetails] = useState({ productName: '', quantity: 1 });
  const [productos, setProductos] = useState([]); 
  const [showConfirmDialog, setShowConfirmDialog] = useState(false); 
  const [currentOrder, setCurrentOrder] = useState(null); 

  useEffect(() => {
    setMessages([
      { text: '¡Hola! Soy el bot de Sushi. ¿Cómo puedo ayudarte hoy?', sender: 'bot' },
    ]);
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await fetch('/productos');
      const data = await response.json();
      setProductos(data);
      
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
  
    // Verificar si el usuario está proporcionando su nombre
    if (lowerMessage.includes('mi nombre es')) {
      const name = message.split('mi nombre es')[1].trim();
      setUserName(name); // Guardar el nombre del usuario
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `¡Encantado de conocerte, ${name}! ¿Cómo puedo ayudarte hoy?`, sender: 'bot' },
      ]);
      return;
    }
  
    // Usar userName para personalizar respuestas en caso de que ya lo tengamos
    if (userName) {
      // Responder usando el nombre del usuario
      if (lowerMessage.includes('hola') || lowerMessage.includes('buenos días')) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: `¡Hola ${userName}! ¿En qué puedo ayudarte hoy?`, sender: 'bot' },
        ]);
        return;
      }
    }

    // Palabras clave para el horario
    const horarioKeywords = ['abren', 'abiertos', 'servicio', 'horario', 'horarios', 'tiempo', 'hora', 'días'];
    // Palabras clave para el menú
    const menuKeywords = ['menu', 'carta', 'piezas', 'platillos', 'sushi', 'productos', 'opciones'];
    // Palabras clave para el pedido
    const orderKeywords = ['pedido', 'ordenar', 'pedir', 'comprar', 'reservar', 'solicitar'];

    // Respuestas a saludos del usuario
    const greetings = ['hola', 'buenos dias', 'buen dia ', 'buenas tardes', 'buenas noches', 'hey'];
    const farewell = ['adiós', 'hasta luego', 'nos vemos', 'chao'];

    let botMessage = 'Lo siento, no entendí eso.';

    if (greetings.some((word) => lowerMessage.includes(word))) {
      botMessage = '¡Hola! ¿En qué puedo ayudarte hoy?';
    } else if (farewell.some((word) => lowerMessage.includes(word))) {
      botMessage = '¡Adiós! Que tengas un excelente día.';
    } else if (horarioKeywords.some((word) => lowerMessage.includes(word))) {
      botMessage = 'Estamos abiertos todos los días de 14:00 a 00:00.';
    } else if (menuKeywords.some((word) => lowerMessage.includes(word))) {
      botMessage = '¡Claro! Aquí está nuestro menú. ¿Qué te gustaría pedir?';
      fetchProductos();
    } else if (orderKeywords.some((word) => lowerMessage.includes(word))) {
      botMessage = '¡Perfecto! ¿Qué producto te gustaría ordenar?';
      setOrdering(true);
    } else if (lowerMessage.includes('ayuda')) {
      botMessage = '¿Cómo puedo ayudarte? Puedes preguntar sobre nuestro menú, horarios, o hacer un pedido.';
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

  const handleConfirmDialog = () => {
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

    setCurrentOrder({
      productName,
      quantity,
      total,
    });

    setShowConfirmDialog(true);
  };

  const handleOrderConfirmation = async (confirmed) => {
    if (confirmed) {
      // Confirmar el pedido y guardarlo en la base de datos
      const { productName, quantity, total } = currentOrder;

      try {
        const response = await fetch('/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productName,
            quantity,
            total,
          }),
        });

        if (!response.ok) {
          throw new Error('No se pudo realizar el pedido');
        }

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: `Tu pedido de ${quantity} ${productName} ha sido confirmado. Total: $${total.toFixed(2)}.`,
            sender: 'bot',
          },
        ]);
      } catch (error) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'Hubo un error al procesar tu pedido. Inténtalo nuevamente.', sender: 'bot' },
        ]);
      }
    } else {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'Pedido cancelado. ¿Te gustaría hacer otro pedido?', sender: 'bot' },
      ]);
    }

    setShowConfirmDialog(false);
    setOrdering(false);
    setOrderDetails({ productName: '', quantity: 1 });
    setCurrentOrder(null);
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

      {/* Ventana de confirmación */}
      {showConfirmDialog && (
        <div className="confirm-dialog">
          <p>¿Estás seguro de que quieres confirmar tu pedido?</p>
          <button onClick={() => handleOrderConfirmation(true)}>Sí</button>
          <button onClick={() => handleOrderConfirmation(false)}>No</button>
        </div>
      )}

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
            <button onClick={handleConfirmDialog}>Confirmar pedido</button>
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
