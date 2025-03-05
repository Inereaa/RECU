
document.addEventListener('DOMContentLoaded', () => {
    const listaCarrito = document.getElementsByClassName('carrito__lista')[0];
    let carrito = JSON.parse(localStorage.getItem('carrito')) || []; // obtiene el carrito desde localStorage

    // función para guardar el carrito en localStorage
    function guardarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(carrito)); // guarda el carrito en localStorage
    }

    // función para calcular el precio total del carrito
    function calcularPrecioTotal() {
        return carrito.reduce((total, producto) => {
            const precio = parseFloat(producto.price) || 0; // asegura que el precio sea un número
            const cantidad = parseInt(producto.cantidad) || 1; // asegura que la cantidad sea un número
            return total + (precio * cantidad); // suma el precio total de los productos
        }, 0);
    }

    // función para actualizar el carrito en la interfaz
    function actualizarCarrito() {
        listaCarrito.innerHTML = ''; // limpia la lista antes de volver a cargarla

        if (carrito.length === 0) {
            listaCarrito.innerHTML = '<p>El carrito está vacío.</p>';
            return;
        }

        carrito.forEach((producto, index) => {
            const productoDiv = document.createElement('div');
            productoDiv.classList.add('producto-carrito');

            const nombre = document.createElement('h3');
            nombre.textContent = producto.name;
            productoDiv.appendChild(nombre);

            const imagen = document.createElement('img');
            imagen.src = producto.image_link;
            imagen.alt = producto.name;
            imagen.style.width = '100px';
            productoDiv.appendChild(imagen);

            const precio = document.createElement('p');
            precio.textContent = `precio: ${producto.price}€`;
            productoDiv.appendChild(precio);

            // crear botones de + y -
            const contenedorCantidad = document.createElement('div');
            contenedorCantidad.classList.add('cantidad-container');

            // botón para restar cantidad
            const botonRestar = document.createElement('button');
            botonRestar.textContent = '-';
            botonRestar.classList.add('btn-cantidad');
            botonRestar.addEventListener('click', () => {
                if (producto.cantidad > 1) {
                    producto.cantidad--;
                    guardarCarrito(); // guarda cambios en localStorage
                    actualizarCarrito(); // actualiza interfaz
                }
            });
            contenedorCantidad.appendChild(botonRestar);

            // mostrar cantidad actual
            const cantidadDisplay = document.createElement('span');
            cantidadDisplay.textContent = producto.cantidad || 1;
            cantidadDisplay.classList.add('cantidad-display');
            contenedorCantidad.appendChild(cantidadDisplay);

            // botón para sumar cantidad
            const botonSumar = document.createElement('button');
            botonSumar.textContent = '+';
            botonSumar.classList.add('btn-cantidad');
            botonSumar.addEventListener('click', () => {
                if (!producto.cantidad) producto.cantidad = 1; // inicializa cantidad si no existe
                producto.cantidad++;
                guardarCarrito(); // guarda cambios en localStorage
                actualizarCarrito(); // actualiza interfaz
            });
            contenedorCantidad.appendChild(botonSumar);

            productoDiv.appendChild(contenedorCantidad);

            // botón para eliminar producto del carrito
            const eliminarBtn = document.createElement('button');
            eliminarBtn.textContent = 'Eliminar';
            eliminarBtn.addEventListener('click', () => {
                carrito.splice(index, 1); // elimina el producto del carrito
                guardarCarrito(); // guarda cambios en localStorage
                actualizarCarrito(); // actualiza interfaz
            });
            productoDiv.appendChild(eliminarBtn);

            listaCarrito.appendChild(productoDiv);
        });

        // mostrar el precio total
        const totalDiv = document.createElement('div');
        totalDiv.classList.add('precio-total');
        const precioTotal = calcularPrecioTotal(); // calcula el precio total
        totalDiv.innerHTML = `<h3>Precio total: ${precioTotal.toFixed(2)}€</h3>`;
        listaCarrito.appendChild(totalDiv);
    }

    // función para generar el código de seguridad
    function generarCodigo() {
        const codigo = Math.floor(Math.random() * 1000000);
        document.getElementById('codigo').textContent = codigo;
        return codigo;
    }

    // función para enviar el correo utilizando emailjs
    function enviarCorreo(carrito) {
        emailjs.send("service_n4c94or", "template_17pdj23")
            .then(() => {
                alert('Pedido realizado con éxito. Se ha enviado un correo de confirmación.');
                carrito.length = 0; // vaciar carrito después de realizar el pedido
                guardarCarrito(); // guardar cambios en localStorage
                actualizarCarrito();
            }, (error) => {
                alert('hubo un error al enviar el correo: ' + error.text);
            });
    }

    // función para realizar el pedido
    document.getElementById('realizarPedido').addEventListener('click', () => {
        const codigoInput = document.getElementById('boot').value;
        const codigoGenerado = document.getElementById('codigo').textContent;

        if (!codigoInput) {
            alert('Por favor, ingresa todos los campos.');
            return;
        }

        if (codigoInput !== codigoGenerado) {
            alert('El código de seguridad no es correcto.');
            return;
        }

        enviarCorreo(carrito);
    });

    // función para borrar el carrito del localStorage
    document.getElementById('cerrarSesion').addEventListener('click', function() {
        localStorage.removeItem('carrito'); // elimina el carrito del localStorage
        const contador = document.getElementById('contador-carrito');
        contador.textContent = '0'; // actualiza el contador del carrito a 0
    });

    generarCodigo(); // generar el código de seguridad al cargar la página
    actualizarCarrito(); // actualizar el carrito al cargar la página
});
