/**
 * Generates a random hexadecimal color string.
 * @returns {string} Random hex color (e.g., "#a3f9c1").
 */
function generateRandomColorHex() {
  return "#000000".replace(/0/g, function () {
    return (~~(Math.random() * 16)).toString(16);
  });
}

export { generateRandomColorHex };
