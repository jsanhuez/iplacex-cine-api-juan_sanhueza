import express from "express";

import {
  handleGetActorByIdRequest,
  handleGetActoresByPeliculaIdRequest,
  handleGetActoresRequest,
  handleInsertActorRequest,
} from "./actor.controller.js";

// Rutas personalizadas para actores
const actorRoutes = express.Router();

actorRoutes.post("/actor", handleInsertActorRequest);

actorRoutes.get("/actores", handleGetActoresRequest);
actorRoutes.get("/actores/:pelicula", handleGetActoresByPeliculaIdRequest);
actorRoutes.get("/actor/:id", handleGetActorByIdRequest);

export default actorRoutes;
