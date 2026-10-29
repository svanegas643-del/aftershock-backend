export const ESTADOS = [
  "Pendiente",
  "En revisión",
  "En proceso",
  "Atendida",
  "Rechazada",
] as const;
export type EstadoSolicitud = (typeof ESTADOS)[number];

export const NECESIDADES = [
  "Alimentación",
  "Agua",
  "Vivienda",
  "Medicamentos",
  "Atención médica",
  "Otros",
] as const;
export type Necesidad = (typeof NECESIDADES)[number];

// ---------- Modelos ----------
export interface Persona {
  id: string;
  nombre: string;
  documento: string;
  telefono: string;
  ubicacion: string;
  fechaRegistro: string;
}

export interface Solicitud {
  id: string;
  personaId: string;
  necesidades: Necesidad[];
  descripcion: string;
  estado: EstadoSolicitud;
  motivo?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

// ---------- DTOs (lo que llega en el body) ----------
export interface CrearPersonaDto {
  nombre: string;
  documento: string;
  telefono: string;
  ubicacion: string;
}

export interface CrearSolicitudDto {
  personaId: string;
  necesidades: string[];
  descripcion?: string;
}

export interface ActualizarEstadoDto {
  estado: string;
  motivo?: string;
}
export const ESTADOS_CAMPANA = ["Verificada", "Sin verificar"] as const;
export type EstadoCampana = (typeof ESTADOS_CAMPANA)[number];

export const METODOS_PAGO = ["Tarjeta", "PSE", "Transferencia"] as const;
export type MetodoPago = (typeof METODOS_PAGO)[number];

export interface Campana {
  id: string;
  nombre: string;
  descripcion: string;
  estado: EstadoCampana;
  meta: number;
  recaudo: number;
  entidadResponsable: string;
}

export interface Donacion {
  id: string;
  campanaId: string;
  monto: number;
  metodoPago: MetodoPago;
  estado: "Simulada";
  fecha: string;
  aviso: string;
}

export interface Ayuda {
  id: string;
  solicitudId: string;
  tipo: Necesidad;
  cantidad: number;
  fechaEntrega: string;
}

export interface CrearDonacionDto {
  campanaId: string;
  monto: number;
  metodoPago: string;
}

export interface CrearAyudaDto {
  solicitudId: string;
  tipo: string;
  cantidad: number;
}