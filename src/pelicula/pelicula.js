import { ObjectId, BSONType } from "mongodb";
import { esEntero, esTextoNoVacio } from "../common/validaciones.js";

export const Pelicula = {
  _id: ObjectId,
  nombre: BSONType.string,
  generos: BSONType.array,
  anioEstreno: BSONType.int,
};

// Valida el body contra el schema "Pelicula"
// Con parcial = true solo se validan los campos presentes
export const validarPelicula = (body = {}, parcial = false) => {
  const errores = [];
  const revisar = (campo) => !parcial || body[campo] !== undefined;

  if (revisar("nombre") && !esTextoNoVacio(body.nombre))
    errores.push("nombre es obligatorio y debe ser un string no vacío");

  if (revisar("generos") && !Array.isArray(body.generos))
    errores.push("generos es obligatorio y debe ser un array");

  if (revisar("anioEstreno") && !esEntero(body.anioEstreno))
    errores.push("anioEstreno es obligatorio y debe ser un número entero");

  return errores;
};
