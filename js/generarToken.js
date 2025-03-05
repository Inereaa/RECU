
// simulación de la generación de un token (similar a un JWT, pero sin las partes de seguridad que este tendría en realidad)
function generarToken() {
    return Math.random().toString(36).substring(2);
}

module.exports = { generarToken };
