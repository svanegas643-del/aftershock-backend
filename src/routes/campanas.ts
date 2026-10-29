import { Router } from "express";
import { campanas } from "../data/db";
import { ESTADOS_CAMPANA } from "../types";

const router = Router();

// GET /api/v1/campanas?estado=Verificada
router.get("/", (req, res) => {
  const { estado } = req.query;

  if (estado === undefined) {
    return res.status(200).json(campanas);
  }

  if (
    typeof estado !== "string" ||
    !(ESTADOS_CAMPANA as readonly string[]).includes(estado)
  ) {
    return res.status(400).json({
      error: "Datos inválidos",
      detalles: [`estado debe ser uno de: ${ESTADOS_CAMPANA.join(", ")}`],
    });
  }

  return res.status(200).json(campanas.filter((c) => c.estado === estado));
});

export default router;