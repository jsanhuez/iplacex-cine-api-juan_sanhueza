// Determina si un valor representa un número entero valido
export const esEntero = (valor) => {
  if (typeof valor === "number") return Number.isInteger(valor);
  if (typeof valor === "string" && valor.trim() !== "")
    return Number.isInteger(Number(valor));
  return false;
};

// Determina si valor es un string no vacio
export const esTextoNoVacio = (valor) =>
  typeof valor === "string" && valor.trim() !== "";
