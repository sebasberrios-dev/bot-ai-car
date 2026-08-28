// Contrato entre el prompt del usuario y los filtros de búsqueda.
// Este archivo NO llama a la API de Anthropic (ver prompt-parser.ts)
// ni consulta el inventario (ver search.service.ts) — solo define la forma.

/**
 * Enum values fijos — deben coincidir EXACTO con los valores usados en
 * demos/kautos/seed-data.json. Si agregás un valor nuevo al inventario
 * (ej. un "camion" o un color de combustible nuevo), agregalo acá también.
 */

export const CAR_TYPES = [
  "sedan",
  "suv",
  "todoterreno",
  "pickup",
  "hatchback",
  "microbus",
] as const;

export const TRANSMISSIONS = ["manual", "automatico"] as const;

export const FUEL_TYPES = ["gasolina", "diesel", "electrico"] as const;

export type CarType = (typeof CAR_TYPES)[number];
export type Transmission = (typeof TRANSMISSIONS)[number];
export type FuelType = (typeof FUEL_TYPES)[number];

/**
 * Filtros que el LLM puede extraer de un prompt en lenguaje natural.
 * TODOS los campos son opcionales: si el modelo no tiene suficiente
 * información en el prompt para inferir un campo, debe omitirlo,
 * nunca inventar un valor.
 */

export interface SearchFilters {
  car_type?: CarType;
  brand?: string;
  min_price?: number;
  max_price?: number;
  min_year?: number;
  max_year?: number;
  max_km?: number;
  transmission?: Transmission;
  fuel_type?: FuelType;
  min_passengers?: number;
}

/**
 * Definición del tool que se le pasa a la API de Anthropic (tool use).
 * Claude "llama" esta función con los filtros que infiere del prompt;
 * el backend nunca ejecuta código del modelo, solo lee el JSON que
 * devuelve en el bloque tool_use.input y lo valida contra este mismo shape.
 */

export const extractFiltersTool = {
  name: "extract_filters",
  description:
    "Extrae filtros de búsqueda de vehículos a partir de una consulta en " +
    "lenguaje natural en español. Solo incluye un campo si el texto da " +
    "información suficiente para inferirlo con confianza razonable - " +
    "no inventes valores que no estén implícitos en el prompt.",
  input_schema: {
    type: "object",
    properties: {
      car_type: {
        type: "string",
        enum: CAR_TYPES,
        description: "Tipo de carrocería del vehículo buscado.",
      },
      brand: {
        type: "string",
        description:
          "Marca específica mencionada, ej. 'Hyundai'. Omitir si no se menciona ninguna.",
      },
      min_price: {
        type: "number",
        description:
          "Precio mínimo, en la misma unidad que el prompt (colones salvo que se indique dólares).",
      },
      max_price: {
        type: "number",
        description:
          "Precio máximo. Ej: 'menos de 10 millones' -> 10000000. 'menos de 15 mil dólares' -> 15000.",
      },
      min_year: {
        type: "number",
        description:
          "Año mínimo del vehículo, ej. 'del 2018 en adelante' -> 2018.",
      },
      max_year: {
        type: "number",
        description: "Año máximo del vehículo.",
      },
      max_km: {
        type: "number",
        description:
          "Kilometraje máximo aceptable, ej. 'poco kilometraje' -> un valor conservador como 80000.",
      },
      transmission: {
        type: "string",
        enum: TRANSMISSIONS,
        description:
          "Tipo de transmisión, si el prompt la menciona explícita o implícitamente ('automático').",
      },
      fuel_type: {
        type: "string",
        enum: FUEL_TYPES,
        description: "Tipo de combustible, si se menciona explícitamente.",
      },
      min_passengers: {
        type: "number",
        description:
          "Cantidad mínima de pasajeros. Útil para prompts tipo 'carro familiar' (usar 5) o 'para toda la familia' (usar 7).",
      },
    },
    // Ningún campo es obligatorio: el modelo debe poder devolver un objeto
    // vacío o parcial si el prompt es vago (ej. "quiero un carro bueno").
    required: [],
  },
} as const;
