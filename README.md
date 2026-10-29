# Aftershock API

API REST de apoyo humanitario después de terremotos en Colombia. Taller 3 de Construcción de Software.

Hecha con **Node.js + TypeScript + Express**. No usa base de datos: los datos viven en arreglos en memoria y **se borran cada vez que se reinicia el servidor**.

**Integrantes:** [Diaz Zambarno Nicol Estefany], [Garcia Marchena Maira Alejandra], [Vanegas Jimenez Sarha Daniela]

## Requisitos

- Node.js 20 o superior
- npm

## Cómo correr el proyecto

```bash
npm install
npm run dev
```

El servidor queda en `http://localhost:3000`. Para comprobarlo, abre `http://localhost:3000/api/v1/salud`.

## Scripts npm

| Script | Qué hace |
|---|---|
| `npm run dev` | Corre el servidor y lo reinicia al guardar cambios |
| `npm run build` | Compila TypeScript a JavaScript en la carpeta `dist` |
| `npm start` | Corre la versión compilada (`dist/server.js`) |

## Dependencias

- `express`: servidor y rutas
- `cors`: permite que otras aplicaciones (por ejemplo, la app Flutter) consulten la API
- `typescript`, `tsx`, `@types/*` (desarrollo): compilación y ejecución de TypeScript con tipos

## Estructura

```
src/
  types/index.ts         Modelos, DTOs, estados y necesidades
  data/db.ts             Arreglos en memoria y generadores de id
  routes/                Rutas de cada recurso
  app.ts                 Configuración de Express
  server.ts              Arranque del servidor
```

## Endpoints

Los **8 endpoints** del inventario quedaron **implementados**. Prefijo: `/api/v1`.

| Método | Ruta | Descripción | Respuestas | Requiere token |
|---|---|---|---|---|
| POST | `/personas` | Registrar persona afectada | 201, 400, 409 | No |
| GET | `/personas?page=1` | Listar personas (10 por página) | 200, 400 | Sí (solo documentado) |
| POST | `/solicitudes` | Crear solicitud de ayuda | 201, 400, 404 | No |
| GET | `/solicitudes/:id` | Consultar una solicitud | 200, 404 | No |
| PATCH | `/solicitudes/:id/estado` | Cambiar el estado | 200, 400, 404, 409 | Sí (solo documentado) |
| GET | `/campanas?estado=Verificada` | Listar campañas (filtro opcional) | 200, 400 | No |
| POST | `/donaciones` | Registrar donación **simulada** | 201, 400, 404 | No |
| POST | `/ayudas` | Registrar ayuda entregada | 201, 400, 404, 409 | Sí (solo documentado) |

### Estados de una solicitud

`Pendiente` → `En revisión` → `En proceso` → `Atendida`. Desde cualquier estado no final se puede pasar a `Rechazada` (el motivo es obligatorio). `Atendida` y `Rechazada` son estados finales.

### Necesidades válidas

Alimentación, Agua, Vivienda, Medicamentos, Atención médica, Otros.

## Ejemplos con curl

Estos ejemplos funcionan en Git Bash, macOS y Linux. En PowerShell, usa `curl.exe` o la colección de Postman.

```bash
curl -X POST http://localhost:3000/api/v1/personas \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Ana Pérez (ficticia)","documento":"1234567891","telefono":"3125550000","ubicacion":"Popayán, Cauca"}'

curl -X POST http://localhost:3000/api/v1/solicitudes \
  -H "Content-Type: application/json" \
  -d '{"personaId":"P-001","necesidades":["Alimentación","Agua"],"descripcion":"Familia de 4 personas"}'

curl http://localhost:3000/api/v1/solicitudes/CO-000001

curl -X PATCH http://localhost:3000/api/v1/solicitudes/CO-000001/estado \
  -H "Content-Type: application/json" \
  -d '{"estado":"En revisión"}'

curl "http://localhost:3000/api/v1/campanas?estado=Verificada"

curl -X POST http://localhost:3000/api/v1/donaciones \
  -H "Content-Type: application/json" \
  -d '{"campanaId":"C-001","monto":50000,"metodoPago":"PSE"}'
```

Para registrar una ayuda, la solicitud debe estar en `En proceso` o `Atendida`; si no, la API responde 409.

## Limitaciones

- **Sin persistencia:** al reiniciar el servidor se pierden personas, solicitudes, donaciones y ayudas.
- **Sin autenticación:** la columna "Requiere token" indica el diseño previsto, pero en esta versión **no se valida ningún token ni rol**. Cualquiera puede llamar a esos endpoints.
- **Donaciones simuladas:** no se procesa ningún pago real y no modifican el recaudo de las campañas.
- **Datos de demostración:** las campañas (`C-001`, `C-002`, `C-003`) son ficticias. Todos los datos de ejemplo son inventados.

## Colección de Postman

[pegar aquí el enlace de la colección]