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

    // Cargar los productos desde el backend
    const fetchProductos = async () => {
        try {
        const response = await fetch('/productos');
        const data = await response.json();
        setProductos(data); // Guardar productos
        } catch (error) {
        console.error('Error al obtener los productos:', error);
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

        // Procesar la respuesta del bot
        processBotResponse(userMessage);
        }
    };

    const processBotResponse = (message) => {
        let botMessage = 'Lo siento, no entendí eso.';

        if (message.toLowerCase().includes('sushi')) {
        botMessage = '¡Me encanta el sushi! ¿Qué tipo de sushi prefieres?';
        } else if (message.toLowerCase().includes('horario')) {
        botMessage = 'Estamos abiertos todos los días de 14:00 a 00:00.';
        } else if (message.toLowerCase().includes('menu')) {
        botMessage = '¡Aquí está nuestro menú!';
        // Mostrar el menú
        setMessages((prevMessages) => [
            ...prevMessages,
            { text: 'Cargando el menú...', sender: 'bot' },
        ]);
        fetchProductos(); // Llamada a la API para obtener el menú
        } else if (message.toLowerCase().includes('pedido')) {
        botMessage = '¡Perfecto! ¿Qué producto te gustaría ordenar?';
        setOrdering(true);
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

        // Llamada al backend para realizar el pedido
        await fetch('/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName, quantity }),
        });

        setMessages((prevMessages) => [
        ...prevMessages,
        { text: `Tu pedido de ${quantity} ${productName} ha sido recibido.`, sender: 'bot' },
        ]);

        // Restablecer estado de la orden
        setOrdering(false);
        setOrderDetails({ productName: '', quantity: 1 });
    };

    useEffect(() => {
        if (productos.length > 0) {
        // Mostrar los productos cuando se obtengan del backend
        setMessages((prevMessages) => [
            ...prevMessages,
            { text: 'Menú de Sushi:', sender: 'bot' },
        ]);
        productos.forEach((producto) => {
            setMessages((prevMessages) => [
            ...prevMessages,
            { text: `${producto.name}: $${producto.price} - ${producto.description}`, sender: 'bot' },
            ]);
        });
        }
    }, [productos]);

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
