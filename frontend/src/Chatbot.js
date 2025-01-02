import React, { useState, useEffect } from 'react';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [ordering, setOrdering] = useState(false);
  const [orderDetails, setOrderDetails] = useState({ productName: '', quantity: 1 });
  const [productos, setProductos] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [orderList, setOrderList] = useState([]);

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
  
    // Palabras clave de despedida
    const farewellKeywords = ['adios', 'chau', 'hasta luego', 'ya termine', 'finalizar', 'terminar', 'cerrar', 'nos vemos'];
    if (farewellKeywords.some((word) => lowerMessage.includes(word))) {
      setMessages([
        { text: '¡Hasta luego! ¡Gracias por visitar! 😊', sender: 'bot' },
      ]);
      return;
    }
  
    // Detectar nombre del usuario
    const nameRegex = /(?:mi nombre es|soy|me llamo|puedes llamarme|llámame|me dicen|me llaman)\s+(\w+)/i;
    const nameMatch = message.match(nameRegex); // No convertir aquí a minúsculas para conservar case sensitivity del nombre
    if (nameMatch) {
      const name = nameMatch[1];
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
  
    // FAQs y palabras clave
    const faqKeywords = [
      { keyword: 'sashimi', response: 'El sashimi es pescado crudo, cortado en finas rebanadas, que se sirve sin arroz.' },
      { keyword: 'rolls', response: 'Los rolls son un tipo de sushi enrollado con alga nori y relleno de ingredientes como pescado, vegetales o mariscos.' },
      { keyword: 'temaki', response: 'El temaki es un sushi en forma de cono, con alga nori, arroz y relleno, que se come con las manos.' },
      { keyword: 'wasabi', response: 'El wasabi es una pasta picante hecha de una raíz japonesa, que se sirve comúnmente con sushi.' },
      { keyword: 'soja', response: 'La salsa de soja se usa para mojar el sushi, agregando sabor umami. Se recomienda no sumergir el pescado en la salsa de soja, solo el arroz.' }
    ];
  
    const horarioKeywords = ['abren', 'abiertos', 'servicio', 'horario', 'horarios', 'tiempo', 'hora', 'dias'];
    const menuKeywords = ['menu', 'carta', 'piezas', 'platillos', 'productos', 'opciones'];
    const orderKeywords = ['pedido', 'ordenar', 'pedir', 'comprar', 'reservar', 'solicitar'];
    const paymentKeywords = ['pagar', 'transferencia', 'efectivo', 'transferir'];
  
    let botMessage = 'Lo siento, no entendí eso.';
  
    if (faqKeywords.some((faq) => lowerMessage.includes(faq.keyword))) {
      const faqResponse = faqKeywords.find(faq => lowerMessage.includes(faq.keyword));
      botMessage = faqResponse ? faqResponse.response : botMessage;
    } else if (horarioKeywords.some((word) => lowerMessage.includes(word))) {
      botMessage = 'Estamos abiertos todos los días de 14:00 a 00:00.';
    } else if (menuKeywords.some((word) => lowerMessage.includes(word))) {
      botMessage = '¡Claro! Aquí está nuestro menú. ¿Qué te gustaría pedir?';
      fetchProductos();
    } else if (orderKeywords.some((word) => lowerMessage.includes(word))) {
      botMessage = '¡Perfecto! ¿Qué producto te gustaría ordenar?';
      setOrdering(true);
    } else if (paymentKeywords.some((word) => lowerMessage.includes(word))) {
      botMessage = 'Puedes pagar mediante transferencia bancaria o en efectivo al recibir tu pedido. ¿Cómo prefieres pagar?';
    } else if (lowerMessage.includes('ayuda')) {
      botMessage = '¿Cómo puedo ayudarte? Puedes preguntar sobre nuestro menú, horarios, hacer un pedido y métodos de pago.';
    } else if (productos.some((producto) => lowerMessage.includes(producto.name.toLowerCase()))) {
      const product = productos.find(p => lowerMessage.includes(p.name.toLowerCase()));
      botMessage = `${product.name}: ${product.description}`;
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

    setOrderList((prevOrderList) => [...prevOrderList, newOrder]);
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: `Producto agregado: ${quantity} ${productName} - Total: $${total.toFixed(2)}`, sender: 'bot' },
    ]);

    setOrderDetails({ productName: '', quantity: 1 });
  };

  const handleConfirmDialog = () => {
    setShowConfirmDialog(true);
  };

  const handleOrderConfirmation = async (confirmed) => {
    if (confirmed) {
      try {
        const orderData = {
          productos: orderList.map(item => ({
            producto: item.productName,
            cantidad: Number(item.quantity),
            precio: item.total / item.quantity,
          })),
        };

        const response = await fetch('/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
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

    setShowConfirmDialog(false);
    setOrdering(false);
    setOrderList([]);
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
