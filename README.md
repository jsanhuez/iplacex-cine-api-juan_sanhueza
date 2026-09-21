# CINE API - API REST

API REST Express para administración de películas favoritas de empleados de IPLACEX.

## Author

Juan Sanhueza R.

## Variables de entorno

Crear el `.env` antes de levantar la API:

```bash
cp .env.example .env
```

- `MONGODB_URI` — conexión al cluster Atlas (obligatorio)
- `MONGODB_DATABASE` — base de datos a utilizar (obligatorio)
- `PORT` — por defecto `3000`


## Ejecutar con Docker

No requiere tener node instalado.

```bash
docker compose up --build
```

Levanta el contenedor `cine-api` en `http://localhost:3000`.

Para detenerla: `Ctrl+C`, o `docker compose down`.

### Ejecutar local

```bash
npm install
npm start
```

## Probar con Postman

El archivo `cine-api.postman_collection.json` contiene peticiones que cubren todos los endpoints.

1. Levantar API: `docker compose up --build`
2. Importar archivo en Postman (**Import → File**).

Variables de la colección:

- `baseUrl`
- `idPelicula`
- `idActor`
