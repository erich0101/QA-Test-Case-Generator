// Una clave de ofuscación simple. No es para alta seguridad, sino para dificultar la inspección casual.
// Está incrustada en el código, por lo que no es un verdadero secreto.
const XOR_KEY = "GEMINI_QA_GENERATOR_KEY"; // Una clave única para esta aplicación

/**
 * Cifra una cadena de texto usando un cifrado XOR simple y la codifica en Base64.
 * Esto es para ofuscación, no para seguridad robusta.
 * @param text La cadena de texto plano a cifrar.
 * @returns La cadena cifrada y codificada en Base64.
 */
export const encrypt = (text: string): string => {
  if (!text) return '';
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ XOR_KEY.charCodeAt(i % XOR_KEY.length));
  }
  // Se codifica en Base64 para asegurar que los caracteres resultantes son seguros para localStorage.
  return btoa(result);
};

/**
 * Descifra una cadena codificada en Base64 que fue cifrada con la función de cifrado correspondiente.
 * @param encodedText La cadena codificada en Base64 a descifrar.
 * @returns La cadena de texto plano descifrada.
 */
export const decrypt = (encodedText: string): string => {
  if (!encodedText) return '';
  try {
    const text = atob(encodedText);
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ XOR_KEY.charCodeAt(i % XOR_KEY.length));
    }
    return result;
  } catch (e) {
    // Esto puede suceder si la clave almacenada es una clave antigua sin cifrar (no es base64).
    // En este caso, la devolvemos tal cual, manteniendo la compatibilidad hacia atrás.
    // La llamada a la API la validará.
    console.warn("No se pudo descifrar la clave de API, asumiendo que es una clave antigua sin cifrar.");
    return encodedText;
  }
};