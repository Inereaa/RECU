let productosTodos = []; // array para almacenar todos los productos
let productosFiltrados = []; // productos después del filtrado y orden
let inicioCarga = 0; // nº inicial para la carga de productos
const productosPorPag = 8; // nº de productos a cargar por página

// funciones para manejar el carrito
function obtenerCarrito() {
    return JSON.parse(localStorage.getItem('carrito')) || []; // obtiene el carrito desde localStorage
}

function guardarCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito)); // guarda el carrito en localStorage
}

function actualizarContadorCarrito(carrito) {
    const contador = document.getElementById('contador-carrito');
    contador.textContent = carrito.length; // actualiza el contador de productos en el carrito
    guardarCarrito(carrito); // guarda el carrito en localStorage
}

function añadirAlCarrito(carrito, producto) {
    carrito.push(producto); // añade el producto al carrito
    actualizarContadorCarrito(carrito); // actualiza el contador del carrito
}

function solicitudFetch() {
    const selectCategoria = document.getElementById("categoria");
    const selectPrecio = document.getElementById("precio");

    // filtrado de los productos por categoría
    selectCategoria.addEventListener("change", function () {
        const categoriaSeleccionada = selectCategoria.value;
        const precioSeleccionado = selectPrecio.value;
        inicioCarga = 0; // reinicia la carga al cambiar el filtro
        fetchProductos(categoriaSeleccionada, precioSeleccionado);
    });

    // filtrado de los productos por precio
    selectPrecio.addEventListener("change", function () {
        const categoriaSeleccionada = selectCategoria.value;
        const precioSeleccionado = selectPrecio.value;
        inicioCarga = 0; // reinicia la carga al cambiar el filtro
        fetchProductos(categoriaSeleccionada, precioSeleccionado);
    });

    // cargar los productos sin filtro al inicio
    fetchProductos();
}

function fetchProductos(categoria = "c", precio = "none") {
    const url = '../db/dbProductos.json';

    if (productosTodos.length === 0) {
        fetch(url)
            .then(res => res.json())
            .then(json => {
                productosTodos = json.filter((producto, index) => {
                    return !(index === 0 || (index > 2 && index < 201) || (index > 294 && index < 423));
                });

                mostrarProductos(categoria, precio);
            })
            .catch(error => {
                console.error("Error al obtener los productos:", error);
            });
    } else {
        mostrarProductos(categoria, precio);
    }
}

function mostrarProductos(categoria, precio) {
    const div = document.getElementById("respuestaDelServidor");
    if (inicioCarga === 0) div.innerHTML = ''; // esto limpia el contador si se reinicia la página

    productosFiltrados = categoria === "c"
        ? productosTodos
        : productosTodos.filter(producto => producto.product_type === categoria);

    productosFiltrados.sort((a, b) => {
        const precioA = parseFloat(a.price);
        const precioB = parseFloat(b.price);
        return precio === "asc" ? precioA - precioB : precioB - precioA;
    });

    cargarMasProductos();
}

function cargarMasProductos() {
    const div = document.getElementById("respuestaDelServidor");
    const finCarga = Math.min(inicioCarga + productosPorPag, productosFiltrados.length);

    for (let i = inicioCarga; i < finCarga; i++) {
        const producto = productosFiltrados[i];

        const productoDiv = document.createElement('div');
        productoDiv.classList.add('producto');

        const nombre = document.createElement('h3');
        nombre.textContent = producto.name;
        productoDiv.appendChild(nombre);

        const precioElemento = document.createElement('p');
        precioElemento.textContent = producto.price + "€";
        productoDiv.appendChild(precioElemento);

        const imagen = document.createElement('img');
        imagen.src = producto.image_link;
        imagen.alt = producto.name;
        imagen.style.width = '200px';
        productoDiv.appendChild(imagen);

        const detalles = document.createElement('a');
        detalles.textContent = "Ver detalles";
        detalles.href = "#";
        detalles.addEventListener('click', (e) => {
            e.preventDefault();
            mostrarDetalles(producto);
        });
        productoDiv.appendChild(detalles);

        const aniadir = document.createElement('a');
        aniadir.textContent = "Añadir al carrito";
        aniadir.href = "#";
        aniadir.addEventListener('click', (e) => {
            e.preventDefault();
            const carrito = obtenerCarrito(); // obtiene el carrito actual
            añadirAlCarrito(carrito, producto); // añade el producto al carrito y actualiza el contador
        });
        productoDiv.appendChild(aniadir);

        div.appendChild(productoDiv);
    }

    inicioCarga = finCarga; // actualiza el índice inicial para la siguiente carga
    if (inicioCarga >= productosFiltrados.length) {
        window.removeEventListener('scroll', detectarScroll); // detiene el scroll infinito si no hay más productos
    }
}

function detectarScroll() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;

    if (scrolled >= scrollable - 100) { // ajusta el margen del final
        cargarMasProductos();
    }
}

function mostrarDetalles(producto) {
    const modal = document.getElementById('detalles');
    const modalContent = document.getElementById('detalles__ventana');

    modalContent.innerHTML = `
        <h2>${producto.name}</h2>
        <img src="${producto.image_link}" alt="${producto.name}" style="width: 200px;">
        <p><strong>Precio:</strong> ${producto.price}€</p>
        <p><strong>Marca:</strong> ${producto.brand || "No especificada"}</p>
        <p><strong>Descripción:</strong> ${producto.description || "Sin descripción disponible"}</p>
        <a href="#" id="aniadirAlCarrito">Añadir al carrito</a>
        <button id="cerrarDetalles">Cerrar</button>`
    ;

    modal.style.display = "block";

    // agregar la funcionalidad al botón "Añadir al carrito"
    document.getElementById('aniadirAlCarrito').addEventListener('click', (e) => {
        e.preventDefault();
        const carrito = obtenerCarrito();  // obtiene el carrito actual
        añadirAlCarrito(carrito, producto);  // añade el producto al carrito y actualiza el contador
    });

    document.getElementById('cerrarDetalles').addEventListener('click', () => {
        modal.style.display = "none";
    });
}

// simulación de la generación de un token (similar a un JWT, pero sin las partes de seguridad que este tendría en realidad)
function generarToken() {
    return Math.random().toString(36).substring(2);
}

// función para borrar el carrito del localStorage
document.getElementById('cerrarSesion').addEventListener('click', function() {
    localStorage.removeItem('carrito'); // elimina el carrito del localStorage
    const contador = document.getElementById('contador-carrito');
    contador.textContent = '0'; // actualiza el contador del carrito a 0
});


// se llama a esta función al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    solicitudFetch();
    window.addEventListener('scroll', detectarScroll);

    const carrito = obtenerCarrito(); // obtiene el carrito desde localStorage
    const contador = document.getElementById('contador-carrito');
    contador.textContent = carrito.length; // actualiza el contador de productos en el carrito
});
