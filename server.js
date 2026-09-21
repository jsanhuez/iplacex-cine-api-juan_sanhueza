import express from "express";
import cors from "cors";

import { cerrarConexion, conectarAtlas, DB_NAME } from "./src/common/db.js";
import peliculaRoutes from "./src/pelicula/routes.js";
import actorRoutes from "./src/actor/routes.js";

const PORT = process.env.PORT || 3000;

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta por defecto
app.get("/", (req, res) => res.status(200).send("Bienvenido al cine Iplacex"));

// Rutas personalizadas
app.use("/api", peliculaRoutes);
app.use("/api", actorRoutes);

// Ruta no encontrada
app.use((req, res) =>
  res
    .status(404)
    .json({ mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}` })
);

// Manejador generico de errores
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && "body" in error)
    return res.status(400).json({
      mensaje: "El cuerpo de la petición no es un JSON válido",
      detalle: error.message,
    });

  console.error("Error no controlado:", error);
  res
    .status(500)
    .json({ mensaje: "Error interno del servidor", detalle: error.message });
});

// Inicio servidor
const iniciarServidor = async () => {
  try {
    await conectarAtlas();
    console.log(
      `Conexion establecida con cluster de MongoDB Atlas (base de datos ${DB_NAME})`
    );
  } catch (error) {
    console.error(
      "Error al conectar con cluster MongoDB Atlas:",
      error.message
    );
    process.exit(1);
  }

  const servidor = app.listen(PORT, () =>
    console.log(`Servidor escuchando en http://localhost:${PORT}`)
  );

  servidor.on("error", async (error) => {
    console.error(
      "Error al levantar el servidor de Express:",
      error.message
    );
    await cerrarConexion();
    process.exit(1);
  });
};

iniciarServidor();
