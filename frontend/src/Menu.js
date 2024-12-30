import React, { useEffect, useState } from 'react';

const Menu = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/productos')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);  // Verifica que los productos lleguen correctamente
        setProductos(data);
      })
      .catch((error) => console.error('Error al obtener los productos:', error));
  }, []);

  return (
    <div>
      <h1>Menú de Sushi</h1>
      <ul>
        {productos.map((producto) => (
          <li key={producto._id}>
            <strong>{producto.name}</strong><br />
            Precio: ${producto.price}<br />
            Descripción: {producto.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Menu;
