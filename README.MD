Sushi Chatbot - README
Este proyecto es un chatbot interactivo diseñado para ayudar a los usuarios a realizar pedidos de sushi, consultar el menú y obtener información sobre el horario de atención. El chatbot está construido con una arquitectura de backend en Node.js y Express, un frontend en React y utiliza MongoDB para el menú y la gestión de pedidos.

Instalación y Ejecución
Requisitos Previos
Node.js (v16 o superior)
npm (v8 o superior)
MongoDB (instalado y corriendo localmente o acceso a una instancia remota)


Para MongoDB, debe utilizar mongoDB Compass. Una vez dentro deberá crear la base de datos sushi-chatbot	y 2 colecciones una que se llame products y otra pedidos. Los pedidos los carga el cliente cuando ordena sushi, los datos de los productos ya están cargados. Son los siguientes:

Los datos de ejemplo se encuentran en el archivo sushi.json.

Configurar Variables de Entorno Crea un archivo .env en la carpeta raiz con el siguiente contenido:

MONGO_URI=mongodb://localhost:27017/sushi-chatbot

Backend
cd sushi-chatbot
Instalar Dependencias del Backend en caso de que no esten instalas

cd backend
npm install 

Iniciar el Servidor Backend
npm run dev

Instalar Dependencias del Frontend en caso de que no esten instalas

cd ../frontend
npm install
agregar esto en el package.json: "proxy": "http://localhost:3001" en caso que no este

Iniciar la Aplicación Frontend
npm start

Acceder a la Aplicación Abre tu navegador y visita http://localhost:3000 para interactuar con el chatbot.

Ejemplos de Mensajes que Entiende el Bot
Saludos

Mensajes que Entiende el Bot
Saludos:
"Hola"
"Buenos días"
"Buenas tardes"
"Buenas noches"
"Saludos"

Saludos mas nombre
mi nombre es|soy|me llamo|puedes llamarme|llámame|me dicen|me llaman


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


Metodos de pago
"transferencia"
"transferir"
"pagar"
"efectivo"

Piezas
Pregunta por piezas para saber que contienen

Consultar partes del sushi
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

