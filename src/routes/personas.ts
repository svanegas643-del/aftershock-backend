import { Router } from "express";
import { personas, nuevoIdPersona } from "../data/db";
import { CrearPersonaDto, Persona } from "../types";

const router = Router();
const POR_PAGINA = 10;

function esTexto(valor: unknown): valor is string {
  return typeof valor === "string" && valor.trim().length > 0;
}

// POST /api/v1/personas  -> registrar persona afectada
router.post("/", (req, res) => {
  const body = (req.body ?? {}) as Partial<CrearPersonaDto>;
  const errores: string[] = [];

  if (!esTexto(body.nombre)) errores.push("nombre es obligatorio");
  if (!esTexto(body.documento) || !/^\d{5,12}$/.test(body.documento.trim()))
    errores.push("documento es obligatorio y debe tener entre 5 y 12 dígitos");
  if (!esTexto(body.telefono) || !/^\d{7,10}$/.test(body.telefono.trim()))
    errores.push("telefono es obligatorio y debe tener entre 7 y 10 dígitos");
  if (!esTexto(body.ubicacion)) errores.push("ubicacion es obligatoria");

  if (errores.length > 0) {
    return res.status(400).json({ error: "Datos inválidos", detalles: errores });
  }

  const documento = body.documento!.trim();
  if (personas.some((p) => p.documento === documento)) {
    return res
      .status(409)
      .json({ error: "Ya existe una persona registrada con ese documento" });
  }

  const nueva: Persona = {
    id: nuevoIdPersona(),
    nombre: body.nombre!.trim(),
    documento,
    telefono: body.telefono!.trim(),
    ubicacion: body.ubicacion!.trim(),
    fechaRegistro: new Date().toISOString(),
  };
  personas.push(nueva);
  return res.status(201).json(nueva);
});

// GET /api/v1/personas?page=1  -> listar personas
router.get("/", (req, res) => {
  const page = Number(req.query.page ?? 1);
  if (!Number.isInteger(page) || page < 1) {
    return res.status(400).json({ error: "page debe ser un entero mayor o igual a 1" });
  }
  const total = personas.length;
  const totalPaginas = Math.max(1, Math.ceil(total / POR_PAGINA));
  const inicio = (page - 1) * POR_PAGINA;
  return res.status(200).json({
    pagina: page,
    totalPaginas,
    total,
    datos: personas.slice(inicio, inicio + POR_PAGINA),
  });
});

export default router;