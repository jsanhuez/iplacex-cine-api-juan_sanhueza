import express from "express";

import {
  handleDeletePeliculaByIdRequest,
  handleGetPeliculaByIdRequest,
  handleGetPeliculasRequest,
  handleInsertPeliculaRequest,
  handleUpdatePeliculaByIdRequest,
} from "./pelicula.controller.js";

// Rutas personalizadas para peliculas
const peliculaRoutes = express.Router();

peliculaRoutes.post("/pelicula", handleInsertPeliculaRequest);
peliculaRoutes.get("/peliculas", handleGetPeliculasRequest);
peliculaRoutes.get("/pelicula/:id", handleGetPeliculaByIdRequest);
peliculaRoutes.put("/pelicula/:id", handleUpdatePeliculaByIdRequest);
peliculaRoutes.delete("/pelicula/:id", handleDeletePeliculaByIdRequest);

export default peliculaRoutes;
