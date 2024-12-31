import React, { useState, useEffect } from 'react';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [ordering, setOrdering] = useState(false);
  const [orderDetails, setOrderDetails] = useState({ productName: '', quantity: 1 });
  const [productos, setProductos] = useState([]); 
  const [showConfirmDialog, setShowConfirmDialog] = useState(false); 
  // eslint-disable-next-line no-unused-vars
  const [currentOrder, setCurrentOrder] = useState(null); 
  const [orderList, setOrderList] = useState([]); // Lista de pedidos

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

    const farewellKeywords = ['adios', 'chau', 'hasta luego', 'ya termine', 'finalizar', 'terminar'];
    if (farewellKeywords.some((word) => lowerMessage.includes(word))) {
        setMessages([  // Limpiar todos los mensajes cuando se detecta una despedida
          { text: '¡Hasta luego! ¡Gracias por visitar! 😊', sender: 'bot' },
        ]);
        return;
      }
    if (lowerMessage.includes('mi nombre es')) {
      const name = message.split('mi nombre es')[1].trim();
      setUserName(name); 
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `¡Encantado de conocerte, ${name}! ¿Cómo puedo ayudarte hoy?`, sender: 'bot' },
      ]);
      return;
    }

    if (userName) {
      if (lowerMessage.includes('hola') || lowerMessage.includes('buenos dias')) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: `¡Hola ${userName}! ¿En qué puedo ayudarte hoy?`, sender: 'bot' },
        ]);
        return;
      }
    }

    
    const horarioKeywords = ['abren', 'abiertos', 'servicio', 'horario', 'horarios', 'tiempo', 'hora', 'dias'];
    const menuKeywords = ['menu', 'carta', 'piezas', 'platillos', 'sushi', 'productos', 'opciones'];
    const orderKeywords = ['pedido', 'ordenar', 'pedir', 'comprar', 'reservar', 'solicitar'];

    let botMessage = 'Lo siento, no entendí eso.';

    if (horarioKeywords.some((word) => lowerMessage.includes(word))) {
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

  const handleAddToOrder = () => {
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
    const newOrder = {
      productName,
      quantity,
      total,
    };

    setOrderList((prevOrderList) => [...prevOrderList, newOrder]); // Agregar al pedido
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: `Producto agregado: ${quantity} ${productName} - Total: $${total.toFixed(2)}`, sender: 'bot' },
    ]);

    setOrderDetails({ productName: '', quantity: 1 }); // Limpiar campos
  };

  const handleConfirmDialog = () => {
    setShowConfirmDialog(true);
  };

  const handleOrderConfirmation = async (confirmed) => {
    if (confirmed) {
      try {
        // Ajustamos la estructura de los datos para que coincidan con el backend
        const orderData = {
          productos: orderList.map(item => ({
            producto: item.productName,  // Nombre del producto
            cantidad: Number(item.quantity),  // Convertir la cantidad a número
            precio: item.total / item.quantity,  // Si necesitas incluir el precio por unidad
          })),
        };
  
        const response = await fetch('/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),  // Enviar la estructura correcta
        });
  
        if (!response.ok) {
          throw new Error('No se pudo realizar el pedido');
        }
  
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: `Tu pedido ha sido confirmado. Total: $${orderList.reduce((acc, item) => acc + item.total, 0).toFixed(2)}`, sender: 'bot' },
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
  
    // Limpiar estados
    setShowConfirmDialog(false);
    setOrdering(false);
    setOrderList([]); // Limpiar lista de pedidos
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
            <button onClick={handleAddToOrder}>Agregar al pedido</button>
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
