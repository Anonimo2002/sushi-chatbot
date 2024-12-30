import React, { useEffect, useState } from 'react';

const Menu = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch('/productos')
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
            <strong>{producto.nombre}</strong><br />
            Precio: ${producto.precio}<br />
            Descripción: {producto.descripcion}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Menu;
