import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import personasRouter from "./routes/personas";
import solicitudesRouter from "./routes/solicitudes";
import campanasRouter from "./routes/campanas";
import donacionesRouter from "./routes/donaciones";
import ayudasRouter from "./routes/ayudas";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/v1/salud", (_req, res) => {
  res.status(200).json({ mensaje: "Aftershock API funcionando" });
});

app.use("/api/v1/personas", personasRouter);
app.use("/api/v1/solicitudes", solicitudesRouter);
app.use("/api/v1/campanas", campanasRouter);
app.use("/api/v1/donaciones", donacionesRouter);
app.use("/api/v1/ayudas", ayudasRouter);

// Ruta que no existe
app.use((_req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Errores generales (por ejemplo, un JSON mal escrito)
app.use(
  (err: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status && err.status < 500 ? err.status : 500;
    const mensaje = status === 400 ? "JSON inválido" : "Error interno del servidor";
    res.status(status).json({ error: mensaje });
  }
);

export default app;