import { ObjectId, BSONType } from "mongodb";

import { client, DB_NAME } from "../common/db.js";
import { peliculaCollection } from "../pelicula/pelicula.controller.js";
import { Actor, validarActor } from "./actor.js";

// Nombre de la base de datos y colección actores
export const actorCollection = client.db(DB_NAME).collection("actores");

// POST /api/actor
// Se valida que el _id enviado en idPelicula exista en colección peliculas.
export const handleInsertActorRequest = async (req, res) => {
  const errores = validarActor(req.body);

  if (errores.length > 0)
    return res
      .status(400)
      .json({ mensaje: "Los datos del actor no son válidos", errores });

  const { idPelicula } = req.body;
  let _idPelicula;

  try {
    _idPelicula = new ObjectId(idPelicula);
  } catch (error) {
    return res.status(400).json({
      mensaje: `El idPelicula ${idPelicula} está mal formado`,
      detalle: error.message,
    });
  }

  await peliculaCollection
    // Se valida que la pelicula exista en su coleccion
    .findOne({ _id: _idPelicula })
    .then((pelicula) => {
      if (!pelicula)
        return res.status(404).json({
          mensaje: `No existe una pelicula con el _id ${idPelicula}, no es posible asignar el actor`,
        });

      // El schema "Actor" especifica los campos a agregar (_id lo genera MongoDB)
      // idPelicula se toma de pelicula validada, no del body
      const valores = {
        ...req.body,
        idPelicula: pelicula._id.toHexString(),
        estaRetirado: req.body.estaRetirado ?? false,
        premios: req.body.premios ?? [],
      };

      const actor = {};

      for (const campo of Object.keys(Actor)) {
        if (campo === "_id") continue;
        actor[campo] =
          Actor[campo] === BSONType.int
            ? Number(valores[campo])
            : valores[campo];
      }

      // Se inserta el actor en su coleccion
      return actorCollection.insertOne(actor).then((resultado) =>
        res.status(201).json({
          mensaje: `Actor creado correctamente y asociado a la pelicula ${pelicula.nombre}`,
          actor: { _id: resultado.insertedId, ...actor },
        })
      );
    })
    .catch((error) =>
      res.status(500).json({
        mensaje: "Error al insertar el actor",
        detalle: error.message,
      })
    );
};

// GET /api/actores
export const handleGetActoresRequest = async (req, res) => {
  await actorCollection
    .find({})
    .toArray()
    .then((actores) => res.status(200).json(actores))
    .catch((error) =>
      res.status(500).json({
        mensaje: "Error al obtener los actores",
        detalle: error.message,
      })
    );
};

// GET /api/actor/:id
// Obtiene un registro en base a su _id.
export const handleGetActorByIdRequest = async (req, res) => {
  const { id } = req.params;
  let _id;

  try {
    _id = new ObjectId(id);
  } catch (error) {
    return res
      .status(400)
      .json({ mensaje: `El _id ${id} está mal formado`, detalle: error.message });
  }

  await actorCollection
    .findOne({ _id })
    .then((actor) =>
      actor
        ? res.status(200).json(actor)
        : res.status(404).json({ mensaje: `No existe un actor con el _id ${id}` })
    )
    .catch((error) =>
      res.status(500).json({
        mensaje: "Error al obtener el actor",
        detalle: error.message,
      })
    );
};

// GET /api/actores/:pelicula
// Obtiene todos los actores de una película en base al _id de la película.
export const handleGetActoresByPeliculaIdRequest = async (req, res) => {
  const { pelicula } = req.params;
  let idPeliculaHex;

  try {
    idPeliculaHex = new ObjectId(pelicula).toHexString();
  } catch (error) {
    return res.status(400).json({
      mensaje: `El _id de película ${pelicula} está mal formado`,
      detalle: error.message,
    });
  }

  await actorCollection
    .find({ idPelicula: idPeliculaHex })
    .toArray()
    .then((actores) =>
      actores.length > 0
        ? res.status(200).json(actores)
        : res.status(404).json({
            mensaje: `No se encontraron actores para la película con _id ${idPeliculaHex}`,
          })
    )
    .catch((error) =>
      res.status(500).json({
        mensaje: "Error al obtener los actores de la película",
        detalle: error.message,
      })
    );
};
