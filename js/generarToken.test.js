
const { generarToken } = require('./generarToken.js');

describe('generarToken', () => {
  test('debería generar un string alfanumérico', () => {
    const token = generarToken();
    // Verificar que el token generado es un string y no está vacío
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);

    // Verificar que el token es alfanumérico
    expect(token).toMatch(/^[a-z0-9]+$/);
  });

  test('debería generar tokens diferentes cada vez', () => {
    const token1 = generarToken();
    const token2 = generarToken();
    // Verificar que los tokens no sean iguales
    expect(token1).not.toBe(token2);
  });
});
