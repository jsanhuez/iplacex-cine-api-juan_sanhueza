import { ObjectId, BSONType } from "mongodb";
import { esEntero, esTextoNoVacio } from "../common/validaciones.js";

export const Actor = {
  _id: ObjectId,
  idPelicula: BSONType.string,
  nombre: BSONType.string,
  edad: BSONType.int,
  estaRetirado: BSONType.bool,
  premios: BSONType.array,
};

// Valida el body de creacion contra el schema "Actor"
export const validarActor = (body = {}) => {
  const errores = [];

  if (!esTextoNoVacio(body.idPelicula))
    errores.push(
      "idPelicula es obligatorio y debe ser un string con el _id de la película a asociar"
    );

  if (!esTextoNoVacio(body.nombre))
    errores.push("nombre es obligatorio y debe ser un string no vacío");

  if (!esEntero(body.edad))
    errores.push("edad es obligatoria y debe ser un número entero");

  if (body.estaRetirado !== undefined && typeof body.estaRetirado !== "boolean")
    errores.push("estaRetirado debe ser un booleano");

  if (body.premios !== undefined && !Array.isArray(body.premios))
    errores.push("premios debe ser un array");

  return errores;
};
