import { Router } from "express";
import { campanas, donaciones, nuevoIdDonacion } from "../data/db";
import { CrearDonacionDto, Donacion, METODOS_PAGO, MetodoPago } from "../types";

const router = Router();

// (no hay cobro real)
router.post("/", (req, res) => {
  const body = (req.body ?? {}) as Partial<CrearDonacionDto>;
  const errores: string[] = [];

  if (typeof body.campanaId !== "string" || body.campanaId.trim() === "")
    errores.push("campanaId es obligatorio");

  if (
    typeof body.monto !== "number" ||
    !Number.isFinite(body.monto) ||
    body.monto <= 0
  )
    errores.push("monto debe ser un número mayor que 0");

  if (
    typeof body.metodoPago !== "string" ||
    !(METODOS_PAGO as readonly string[]).includes(body.metodoPago)
  )
    errores.push(`metodoPago debe ser uno de: ${METODOS_PAGO.join(", ")}`);

  if (errores.length > 0) {
    return res.status(400).json({ error: "Datos inválidos", detalles: errores });
  }

  const campana = campanas.find((c) => c.id === body.campanaId);
  if (!campana) {
    return res.status(404).json({ error: "Campaña no encontrada" });
  }

  const nueva: Donacion = {
    id: nuevoIdDonacion(),
    campanaId: campana.id,
    monto: body.monto as number,
    metodoPago: body.metodoPago as MetodoPago,
    estado: "Simulada",
    fecha: new Date().toISOString(),
    aviso: "Donación de demostración. No se realizó ningún cobro.",
  };
  donaciones.push(nueva);
  return res.status(201).json(nueva);
});

export default router;