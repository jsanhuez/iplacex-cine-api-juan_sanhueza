import { ObjectId, BSONType } from "mongodb";

import { client, DB_NAME } from "../common/db.js";
import { Pelicula, validarPelicula } from "./pelicula.js";

// Nombre de la base de datos y colección películas
export const peliculaCollection = client.db(DB_NAME).collection("peliculas");

// POST /api/pelicula
export const handleInsertPeliculaRequest = async (req, res) => {
  const errores = validarPelicula(req.body);

  if (errores.length > 0)
    return res
      .status(400)
      .json({ mensaje: "Los datos de la película no son válidos", errores });

  // El schema "Pelicula" especifica los campos a agregar (_id lo genera MongoDB)
  const pelicula = {};

  for (const campo of Object.keys(Pelicula)) {
    if (campo === "_id") continue;
    pelicula[campo] =
      Pelicula[campo] === BSONType.int
        ? Number(req.body[campo])
        : req.body[campo];
  }

  await peliculaCollection
    .insertOne(pelicula)
    .then((resultado) =>
      res.status(201).json({
        mensaje: "Película creada correctamente",
        pelicula: { _id: resultado.insertedId, ...pelicula },
      })
    )
    .catch((error) =>
      res.status(500).json({
        mensaje: "Error al insertar la película",
        detalle: error.message,
      })
    );
};

// GET /api/peliculas
export const handleGetPeliculasRequest = async (req, res) => {
  await peliculaCollection
    .find({})
    .toArray()
    .then((peliculas) => res.status(200).json(peliculas))
    .catch((error) =>
      res.status(500).json({
        mensaje: "Error al obtener las películas",
        detalle: error.message,
      })
    );
};

// GET /api/pelicula/:id
// Obtiene un registro en base a su _id.
export const handleGetPeliculaByIdRequest = async (req, res) => {
  const { id } = req.params;
  let _id;

  try {
    _id = new ObjectId(id);
  } catch (error) {
    return res
      .status(400)
      .json({ mensaje: `El _id ${id} está mal formado`, detalle: error.message });
  }

  await peliculaCollection
    .findOne({ _id })
    .then((pelicula) =>
      pelicula
        ? res.status(200).json(pelicula)
        : res
            .status(404)
            .json({ mensaje: `No existe una película con el _id ${id}` })
    )
    .catch((error) =>
      res.status(500).json({
        mensaje: "Error al obtener la película",
        detalle: error.message,
      })
    );
};

// PUT /api/pelicula/:id
// Actualiza un registro en base a su _id
export const handleUpdatePeliculaByIdRequest = async (req, res) => {
  const { id } = req.params;
  let _id;

  try {
    _id = new ObjectId(id);
  } catch (error) {
    return res
      .status(400)
      .json({ mensaje: `El _id ${id} está mal formado`, detalle: error.message });
  }

  const errores = validarPelicula(req.body, true);

  if (errores.length > 0)
    return res
      .status(400)
      .json({ mensaje: "Los datos de la película no son válidos", errores });

  // El schema "Pelicula" especifica los campos a actualizar
  const cambios = {};

  for (const campo of Object.keys(Pelicula)) {
    if (campo === "_id" || req.body[campo] === undefined) continue;
    cambios[campo] =
      Pelicula[campo] === BSONType.int
        ? Number(req.body[campo])
        : req.body[campo];
  }

  if (Object.keys(cambios).length === 0)
    return res.status(400).json({
      mensaje:
        "Debe enviar al menos un campo válido para actualizar: nombre, generos o anioEstreno",
    });

  await peliculaCollection
    .findOneAndUpdate({ _id }, { $set: cambios }, { returnDocument: "after" })
    .then((pelicula) =>
      pelicula
        ? res.status(200).json({
            mensaje: "Película actualizada correctamente",
            pelicula,
          })
        : res
            .status(404)
            .json({ mensaje: `No existe una película con el _id ${id}` })
    )
    .catch((error) =>
      res.status(500).json({
        mensaje: "Error al actualizar la película",
        detalle: error.message,
      })
    );
};

// DELETE /api/pelicula/:id
// Elimina un registro en base a su _id.
export const handleDeletePeliculaByIdRequest = async (req, res) => {
  const { id } = req.params;
  let _id;

  try {
    _id = new ObjectId(id);
  } catch (error) {
    return res
      .status(400)
      .json({ mensaje: `El _id ${id} está mal formado`, detalle: error.message });
  }

  await peliculaCollection
    .findOneAndDelete({ _id })
    .then((pelicula) =>
      pelicula
        ? res.status(200).json({
            mensaje: "Película eliminada correctamente",
            pelicula,
          })
        : res
            .status(404)
            .json({ mensaje: `No existe una película con el _id ${id}` })
    )
    .catch((error) =>
      res.status(500).json({
        mensaje: "Error al eliminar la película",
        detalle: error.message,
      })
    );
};
