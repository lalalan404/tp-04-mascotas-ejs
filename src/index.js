const express = require("express");
const path = require("node:path");
const { leerJson } = require("./archivos");
const expressLayouts = require("express-ejs-layouts");
const PORT = 3000;
const rutaDatos = path.join(__dirname, "..", "datos", "mascotas.json");

async function main() {
  const mascotas = await leerJson(rutaDatos);
  const app = express();
  //--motor de vistas
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "..", "views"));
  //--activando layout
  app.use(expressLayouts);
  app.set("layout", "layouts/main");
  //--pasando la direccion de losm recursos estaticos
  app.use(express.static(path.join(__dirname, "..", "public")));
  //---ruta para el formulario
  app.use(express.urlencoded({ extended: false }));
  //--rutas
  app.get("/api/mascotas", (req, res) => {
    res.json(mascotas);
  });
  app.get("/", (req, res) => {
    res.render("inicio", { titulo: "Mascotas en Adopcion" });
  });
  app.get("/mascotas/nueva", (req, res) => {
    res.render("mascotas/nueva", {
      titulo: "Nueva Mascota",
      error: null,
      valores: {},
    });
  });
  app.get("/mascotas/:id", (req, res) => {
    const id = Number(req.params.id);
    const mascota = mascotas.find((elemento) => elemento.id === id);
    if (!mascota) {
      return res.status(404).render("no-encontrado", {
        titulo: "mascota no encontrada",
        mensaje: "No existe un mascota con ese identificador.",
      });
    }
    res.render("mascotas/detalle", {
      titulo: mascota.nombre,
      mascota,
    });
  });
  app.get("/mascotas", (req, res) => {
    res.render("mascotas/lista", {
      titulo: "Mascotas en Adopcion",
      mascotas,
    });
  });
  //--ruta para agregar el form
  app.post("/mascotas", (req, res) => {
    const { nombre, especie, edad, descripcion, estado } = req.body;

    const nombreLimpio = String(nombre ?? "").trim();
    const especieLimpia = String(especie ?? "").trim();
    const descripcionLimpio = String(descripcion ?? "").trim();
    const edadNumerico = Number(edad);
    const estadoLimpio = String(estado ?? "").trim();
    if (
      !nombreLimpio ||
      !especieLimpia ||
      !descripcionLimpio ||
      !estadoLimpio ||
      !Number.isFinite(edadNumerico) ||
      edadNumerico <= 0
    ) {
      return res.status(400).render("mascotas/nueva", {
        titulo: "Nueva mascota",
        error: "Completá todos los campos con valores válidos.",
        valores: req.body,
      });
    }
    const ultimoId = mascotas.reduce(
      (mayorId, producto) => Math.max(mayorId, producto.id),
      0,
    );
    mascotas.push({
      id: ultimoId + 1,
      nombre: nombreLimpio,
      especie: especieLimpia,
      edad: edadNumerico,
      estado: estadoLimpio,
      descripcion: descripcionLimpio,
      imagen: "/img/mascota.svg",
    });
    res.redirect("/mascotas");
  });
  app.listen(PORT, () => {
    console.log(`Aplicación disponible en http://localhost:${PORT}`);
  });
}
main().catch((error) => {
  console.error("No se pudo iniciar la aplicación:", error);
  process.exitCode = 1;
});
