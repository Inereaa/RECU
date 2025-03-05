/**
 * Archivo de manejo de login.
 * Este script escucha el evento de envío del formulario y verifica las credenciales del usuario
 * contra un servidor JSON.
 * 
 * @file login.js
 */

document.addEventListener('DOMContentLoaded', () => {
    /**
     * Evento que se activa cuando se envía el formulario.
     * Se encarga de prevenir el envío por defecto, obtener las credenciales, y
     * validar contra un servidor externo.
     * 
     * @event submit
     * @param {Event} event - El evento de envío del formulario.
     */
    document.getElementById('form').addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita el envío por defecto del formulario

        // Obtiene los valores de los campos del formulario
        const user = document.getElementById('user').value;
        const passw = document.getElementById('passw').value;
        const msg = document.getElementById('msg');
        msg.innerHTML = '';

        try {
            /**
             * Realiza una consulta al servidor JSON para verificar el usuario y contraseña.
             * @async
             * @function fetch
             * @throws {Error} Si no se puede conectar al servidor o ocurre un error en la consulta.
             */
            const response = await fetch('https://neikap.work.gd/api/users');
            if (!response.ok) throw new Error('Error al conectar con el servidor');

            // Obtiene la lista de usuarios en formato JSON
            const users = await response.json();

            // Verifica si el usuario y contraseña coinciden
            const existe = users.find(u => u.username == user && u.password == passw);

            if (existe) {
                // Redirige al usuario a la página principal si las credenciales son válidas
                window.location.href = '../index.html';
            } else {
                // Muestra un mensaje de error si las credenciales no son válidas
                msg.innerHTML = 'Usuario o contraseña incorrectos.';
            }
        } catch (error) {
            // Manejo de errores: conexión fallida u otros problemas
            console.error('Error:', error);
            msg.innerHTML = 'Error al iniciar sesión.';
        }
    });
});
