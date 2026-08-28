# bot-ai-car

Widget de búsqueda conversacional (lenguaje natural) para sitios web de agencias de autos usados en Costa Rica. El usuario escribe algo como _"SUV automático, menos de 10 millones, del 2017 en adelante"_ y el sistema devuelve vehículos del inventario real que calzan, sin filtros manuales.

**Meta inmediata:** demo funcional con el inventario de [KAutos](https://kautoscr.com).  
**Meta de producto:** SaaS multi-tenant con widget embebible por agencia.

Documentación de arquitectura completa: [`ARCHITECTURE.md`](./ARCHITECTURE.md).

---

## Estado actual (Fase 0 — demo KAutos)

Progreso estimado hacia demo funcional: **~15–20%**.

| Área             | Estado    | Notas                                                                     |
| ---------------- | --------- | ------------------------------------------------------------------------- |
| Monorepo + setup | Listo     | pnpm workspaces, TypeScript, dependencias instaladas                      |
| Capa LLM         | Parcial   | Cliente Anthropic y schema de filtros listos; falta implementar el parser |
| API REST         | Pendiente | `server.ts` vacío; no hay módulo `search` ni endpoints                    |
| Widget           | Pendiente | Archivos creados pero vacíos; sin `package.json` ni build                 |
| Demo KAutos      | Parcial   | `seed-data.json` con 6 vehículos; `demo.html` vacío                       |

### Implementado

- **`apps/api/src/modules/llm/claude-client.ts`** — instancia única del SDK de Anthropic y modelo `claude-haiku-4-5-20251001`.
- **`apps/api/src/modules/llm/filter-schema.ts`** — enums (`car_type`, `transmission`, `fuel_type`), tipo `SearchFilters` y tool `extract_filters` para Claude tool use.
- **`apps/api/src/modules/llm/prompt-parser.ts`** — esqueleto con `FilterParseError`; falta la función que llama a Claude.
- **`demos/kautos/seed-data.json`** — inventario real de KAutos (6 vehículos).
- **`ARCHITECTURE.md`** — contexto de arquitectura, contrato de API y convenciones.

### Pendiente para demo funcional

1. Completar `prompt-parser.ts` (extracción de filtros vía tool use).
2. Crear `search.service.ts` con filtrado en memoria sobre `seed-data.json`.
3. Levantar Fastify con `POST /v1/search` y `GET /v1/health`.
4. Implementar widget mínimo (`SearchBox`, `ResultsGrid`, `api-client`) y `demos/kautos/demo.html`.

---

## Stack

| Capa    | Tecnología                                  |
| ------- | ------------------------------------------- |
| Backend | Node.js, TypeScript, Fastify                |
| LLM     | Claude Haiku 4.5 (Anthropic API, tool use)  |
| Widget  | TypeScript vanilla + esbuild (planeado)     |
| Demo    | JSON estático en memoria, sin base de datos |

---

## Estructura del repo

```
bot-ai-car/
├── apps/
│   ├── api/                          # Backend REST API
│   │   └── src/modules/
│   │       ├── llm/                  # Capa aislada de Anthropic
│   │       │   ├── claude-client.ts  ✅
│   │       │   ├── filter-schema.ts  ✅
│   │       │   └── prompt-parser.ts  🟡
│   │       └── server.ts             🔴 (vacío)
│   └── widget/                       # Widget embebible
│       └── src/                      🔴 (archivos vacíos)
├── demos/kautos/
│   ├── seed-data.json                ✅
│   └── demo.html                     🔴 (vacío)
├── ARCHITECTURE.md
├── package.json
└── pnpm-workspace.yaml
```

---

## Requisitos

- Node.js 20+
- pnpm 9+
- API key de Anthropic

---

## Setup

```bash
# Clonar e instalar dependencias
pnpm install

# Configurar variables de entorno (copiar y completar)
cp .env.example .env
```

Variables de entorno necesarias:

```
ANTHROPIC_API_KEY=
PORT=3000
NODE_ENV=development
```

---

## Scripts

```bash
pnpm dev:api      # Levantar API en modo desarrollo (cuando server.ts esté implementado)
pnpm build:api    # Compilar TypeScript de la API
pnpm dev:widget   # Levantar widget en desarrollo (cuando exista el package del widget)
```

Verificar tipos de la API:

```bash
cd apps/api && npx tsc --noEmit
```

---

## Convenciones

- TypeScript estricto, nombres de código en inglés, copys al usuario en español.
- Ningún módulo fuera de `llm/` importa el SDK de Anthropic directamente.
- Los enums de filtros deben coincidir con los valores en `demos/kautos/seed-data.json`.
- Ver [`ARCHITECTURE.md`](./ARCHITECTURE.md) sección 12 para el resto de convenciones del agente de código.

---

## Fases de construcción

| Fase  | Descripción                         | Estado      |
| ----- | ----------------------------------- | ----------- |
| **0** | Demo KAutos en memoria, sin DB      | En progreso |
| 1     | Postgres + ingestion CSV            | Pendiente   |
| 2     | Panel interno para agencias         | Pendiente   |
| 3     | `search_logs` + facturación por uso | Pendiente   |
| 4     | API directa (sin widget)            | Pendiente   |

---

## Licencia

Privado — uso interno.
