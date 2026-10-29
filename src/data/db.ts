import { Ayuda, Campana, Donacion, Persona, Solicitud } from "../types";

export const personas: Persona[] = [];
export const solicitudes: Solicitud[] = [];
export const donaciones: Donacion[] = [];
export const ayudas: Ayuda[] = [];

// (ficticios)
export const campanas: Campana[] = [
  {
    id: "C-001",
    nombre: "Terremoto Zona A (demostración)",
    descripcion: "Alimentación, vivienda y medicamentos para familias afectadas.",
    estado: "Verificada",
    meta: 100000000,
    recaudo: 95000000,
    entidadResponsable: "Entidad de ejemplo A",
  },
  {
    id: "C-002",
    nombre: "Terremoto Zona B (demostración)",
    descripcion: "Apoyo con agua potable y atención médica.",
    estado: "Verificada",
    meta: 70000000,
    recaudo: 42000000,
    entidadResponsable: "Entidad de ejemplo B",
  },
  {
    id: "C-003",
    nombre: "Campaña Zona C (demostración)",
    descripcion: "Campaña sin proceso de verificación.",
    estado: "Sin verificar",
    meta: 30000000,
    recaudo: 5000000,
    entidadResponsable: "Sin información",
  },
];

let contadorPersonas = 0;
let contadorSolicitudes = 0;
let contadorDonaciones = 0;
let contadorAyudas = 0;

export function nuevoIdPersona(): string {
  contadorPersonas += 1;
  return `P-${String(contadorPersonas).padStart(3, "0")}`;
}

export function nuevoIdSolicitud(): string {
  contadorSolicitudes += 1;
  return `CO-${String(contadorSolicitudes).padStart(6, "0")}`;
}

export function nuevoIdDonacion(): string {
  contadorDonaciones += 1;
  return `D-${String(contadorDonaciones).padStart(3, "0")}`;
}

export function nuevoIdAyuda(): string {
  contadorAyudas += 1;
  return `A-${String(contadorAyudas).padStart(3, "0")}`;
}