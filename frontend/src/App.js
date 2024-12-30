import React, { useEffect, useState } from 'react';
import './App.css';   


function App() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch('/productos')
      .then((response) => response.json())
      .then((data) => {
        console.log('productos recibidos',data);  // Verifica que los datos se están recibiendo
        setProductos(data);  // Establece los productos en el estado
      })
      .catch((error) => console.error('Error al obtener los productos:', error));
  }, []);

  return (
    <div className="App">
    <h1>Menú de Sushi</h1>
    <ul>
      {productos.length === 0 ? (
        <p>Cargando productos...</p>  /* Mostrar mensaje mientras carga */
      ) : (
        productos.map((producto) => (
          <li key={producto._id}>
            <h2>{producto.name}</h2>
            <p>{producto.description}</p>  {/* Mostrar la descripción */}
            <p>${producto.price }</p>
          </li>
        ))
      )}
    </ul>
  </div>
);
}

export default App;
