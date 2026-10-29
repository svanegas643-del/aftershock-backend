import { Router } from "express";
import { personas, solicitudes, nuevoIdSolicitud } from "../data/db";

import {
  ActualizarEstadoDto,
  CrearSolicitudDto,
  ESTADOS,
  EstadoSolicitud,
  NECESIDADES,
  Necesidad,
  Solicitud,
} from "../types";

const router = Router();

// Qué cambios de estado están permitidos
const TRANSICIONES: Record<EstadoSolicitud, EstadoSolicitud[]> = {
  Pendiente: ["En revisión", "Rechazada"],
  "En revisión": ["En proceso", "Rechazada"],
  "En proceso": ["Atendida", "Rechazada"],
  Atendida: [],
  Rechazada: [],
};

// POST /api/v1/solicitudes  -> crear solicitud
router.post("/", (req, res) => {
  const body = (req.body ?? {}) as Partial<CrearSolicitudDto>;
  const errores: string[] = [];

  if (typeof body.personaId !== "string" || body.personaId.trim() === "")
    errores.push("personaId es obligatorio");

  if (!Array.isArray(body.necesidades) || body.necesidades.length === 0) {
    errores.push("necesidades debe incluir al menos una opción");
  } else {
    const invalidas = body.necesidades.filter(
      (n) => !(NECESIDADES as readonly string[]).includes(n)
    );
    if (invalidas.length > 0)
      errores.push(
        `necesidades no válidas: ${invalidas.join(", ")}. Permitidas: ${NECESIDADES.join(", ")}`
      );
  }

  if (body.descripcion !== undefined && typeof body.descripcion !== "string")
    errores.push("descripcion debe ser texto");

  if (errores.length > 0) {
    return res.status(400).json({ error: "Datos inválidos", detalles: errores });
  }

  const persona = personas.find((p) => p.id === body.personaId);
  if (!persona) {
    return res.status(404).json({ error: "Persona no encontrada" });
  }

  const ahora = new Date().toISOString();
  const nueva: Solicitud = {
    id: nuevoIdSolicitud(),
    personaId: persona.id,
    necesidades: body.necesidades as Necesidad[],
    descripcion: (body.descripcion ?? "").trim(),
    estado: "Pendiente",
    fechaCreacion: ahora,
    fechaActualizacion: ahora,
  };
  solicitudes.push(nueva);
  return res.status(201).json(nueva);
});

// GET /api/v1/solicitudes/:id  -> consultar una solicitud
router.get("/:id", (req, res) => {
  const solicitud = solicitudes.find((s) => s.id === req.params.id);
  if (!solicitud) {
    return res.status(404).json({ error: "Solicitud no encontrada" });
  }
  return res.status(200).json(solicitud);
});

// PATCH /api/v1/solicitudes/:id/estado  -> cambiar estado (admin)
router.patch("/:id/estado", (req, res) => {
  const body = (req.body ?? {}) as Partial<ActualizarEstadoDto>;

  if (
    typeof body.estado !== "string" ||
    !(ESTADOS as readonly string[]).includes(body.estado)
  ) {
    return res.status(400).json({
      error: "Estado inválido",
      detalles: [`estado debe ser uno de: ${ESTADOS.join(", ")}`],
    });
  }

  const solicitud = solicitudes.find((s) => s.id === req.params.id);
  if (!solicitud) {
    return res.status(404).json({ error: "Solicitud no encontrada" });
  }

  const nuevoEstado = body.estado as EstadoSolicitud;
  if (!TRANSICIONES[solicitud.estado].includes(nuevoEstado)) {
    return res.status(409).json({
      error: `No se puede pasar de "${solicitud.estado}" a "${nuevoEstado}"`,
      permitidos: TRANSICIONES[solicitud.estado],
    });
  }

  if (nuevoEstado === "Rechazada") {
    if (typeof body.motivo !== "string" || body.motivo.trim() === "") {
      return res.status(400).json({
        error: "Datos inválidos",
        detalles: ["motivo es obligatorio cuando el estado es Rechazada"],
      });
    }
    solicitud.motivo = body.motivo.trim();
  }

  solicitud.estado = nuevoEstado;
  solicitud.fechaActualizacion = new Date().toISOString();
  return res.status(200).json(solicitud);
});

export default router;