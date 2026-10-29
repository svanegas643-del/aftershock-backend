import { Router } from "express";
import { ayudas, nuevoIdAyuda, solicitudes } from "../data/db";
import { Ayuda, CrearAyudaDto, NECESIDADES, Necesidad } from "../types";

const router = Router();

// (solo administrador)
router.post("/", (req, res) => {
  const body = (req.body ?? {}) as Partial<CrearAyudaDto>;
  const errores: string[] = [];

  if (typeof body.solicitudId !== "string" || body.solicitudId.trim() === "")
    errores.push("solicitudId es obligatorio");

  if (
    typeof body.tipo !== "string" ||
    !(NECESIDADES as readonly string[]).includes(body.tipo)
  )
    errores.push(`tipo debe ser uno de: ${NECESIDADES.join(", ")}`);

  if (
    typeof body.cantidad !== "number" ||
    !Number.isInteger(body.cantidad) ||
    body.cantidad <= 0
  )
    errores.push("cantidad debe ser un entero mayor que 0");

  if (errores.length > 0) {
    return res.status(400).json({ error: "Datos inválidos", detalles: errores });
  }

  const solicitud = solicitudes.find((s) => s.id === body.solicitudId);
  if (!solicitud) {
    return res.status(404).json({ error: "Solicitud no encontrada" });
  }

  if (solicitud.estado !== "En proceso" && solicitud.estado !== "Atendida") {
    return res.status(409).json({
      error: `No se puede registrar una ayuda para una solicitud en estado "${solicitud.estado}"`,
      permitidos: ["En proceso", "Atendida"],
    });
  }

  const nueva: Ayuda = {
    id: nuevoIdAyuda(),
    solicitudId: solicitud.id,
    tipo: body.tipo as Necesidad,
    cantidad: body.cantidad as number,
    fechaEntrega: new Date().toISOString(),
  };
  ayudas.push(nueva);
  return res.status(201).json(nueva);
});

export default router;