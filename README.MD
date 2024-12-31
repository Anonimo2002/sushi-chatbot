Sushi Chatbot - README
Este proyecto es un chatbot interactivo diseñado para ayudar a los usuarios a realizar pedidos de sushi, consultar el menú y obtener información sobre el horario de atención. El chatbot está construido con una arquitectura de backend en Node.js y Express, un frontend en React y utiliza MongoDB para el menú y la gestión de pedidos.

Instalación y Ejecución
Requisitos Previos
Node.js (v16 o superior)
npm (v8 o superior)
MongoDB (instalado y corriendo localmente o acceso a una instancia remota)
Pasos para Instalar y Ejecutar el Proyecto
Clonar el Repositorio

Para mongoDB, debe utilizar mongoDB Compass. Una vez dentro deberá crear la base de datos sushi-chatbot	y 2 colecciones una que se llame products y otra pedidos. Los pedidos los carga el cliente cuando ordena sushi, los datos de los productos ya están cargados. Son los siguientes:


[
  {
    "name": "Sushi Nigiri",
    "price": 5.00,
    "description": "Arroz de sushi con una rebanada de pescado fresco encima."
  },
  {
    "name": "Sushi Maki",
    "price": 8.00,
    "description": "Arroz de sushi enrollado con alga nori y relleno de pescado o vegetales."
  },
  {
    "name": "Sushi Sashimi",
    "price": 10.00,
    "description": "Rebanadas finas de pescado crudo, servidas sin arroz."
  },
  {
    "name": "California Roll",
    "price": 9.00,
    "description": "Rollo de sushi con cangrejo, aguacate y pepino, envuelto en arroz."
  },
  {
    "name": "Tempura Roll",
    "price": 11.00,
    "description": "Rollo de sushi con camarones tempura y vegetales, envuelto en arroz."
  },
  {
    "name": "Spicy Tuna Roll",
    "price": 12.00,
    "description": "Rollo de sushi con atún picante y aguacate, envuelto en arroz."
  },
  {
    "name": "Dragon Roll",
    "price": 14.00,
    "description": "Rollo de sushi con anguila y aguacate, decorado con salsa dulce."
  },
  {
    "name": "Philadelphia Roll",
    "price": 13.00,
    "description": "Rollo de sushi con salmón ahumado y queso crema."
  }
]

cd sushi-chatbot

Instalar Dependencias del Backend

cd backend
npm install

Configurar Variables de Entorno Crea un archivo .env en la carpeta backend con el siguiente contenido:

MONGO_URI=mongodb://localhost:27017/sushi-chatbot

Iniciar el Servidor Backend


npm start

Instalar Dependencias del Frontend

cd ../frontend
npm install
Iniciar la Aplicación Frontend

npm start
Acceder a la Aplicación Abre tu navegador y visita http://localhost:3000 para interactuar con el chatbot.

Mensajes que Entiende el Bot
Saludos:
"Hola"
"Buenos días"
"Buenas tardes"

Consultar el Menú:
"¿Qué tienen en el menú?"
"Muéstrame el menú de sushi"
"¿Qué opciones tienen?"
"Me mostraria la carta"
"Que piezas tienen disponibles"
"productos"
"opciones"
"platillos"

Consultar Horarios
"¿A qué hora abren?"
"¿Cuál es su horario de atención?"
"¿Están abiertos ahora?"
"servicio"
"tiempo"
"hora"
"dias"

Realizar un Pedido
"Quiero hacer un pedido"
"¿Puedo ordenar sushi?"
"Quiero comprar sushi"
"Quiero pedir"
"Me gustaria reservar"

Despedidas
"adios"
"hasta luego"
"os vemos"
"chau"
"ya termine"
"finalizar"
"terminar"
"cerrar"

Consultar partes del sushi
"sushi"
"wasabi"
"sashimi"
"rolls"
"temaki"
"soja"

Endpoints Disponibles
Backend
GET /productos

Descripción: Obtiene la lista de productos disponibles en el menú.
Respuesta:

[
  {
    "_id": "12345",
    "nombre": "Sushi de Atún",
    "descripcion": "Sushi fresco de atún",
    "precio": 10.99
  }
]
POST /orders

Descripción: Crea un nuevo pedido.
Cuerpo de la Solicitud:


{
  "productName": "Sushi de Atún",
  "quantity": 2
}
Respuesta:

{
  "_id": "67890",
  "producto": "Sushi de Atún",
  "cantidad": 2,
  "estado": "pendiente"
}


Frontend
GET /
Descripción: Página principal del chatbot.
Respuesta: Interfaz de usuario del chatbot.


¡Gracias por usar el Sushi Chatbot! Si tienes alguna pregunta o sugerencia, no dudes en contactarnos.
