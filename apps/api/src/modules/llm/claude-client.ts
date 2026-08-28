// apps/api/src/llm/claude-client.ts
//
// Único lugar del backend que instancia el SDK de Anthropic.
// Ningún otro módulo debe hacer `import Anthropic from "@anthropic-ai/sdk"`
// directamente — todo pasa por acá (ver ARCHITECTURE.md, sección 12).

import Anthropic from "@anthropic-ai/sdk";

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("Falta ANTHROPIC_API_KEY en las variables de entorno.");
}

export const claudeClient = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Modelo usado para extracción de filtros: tarea de clasificación
// estructurada, no necesita razonamiento pesado — Haiku es suficiente
// y es el más barato para un endpoint que se llama en cada búsqueda.
export const FILTER_MODEL = "claude-haiku-4-5-20251001";
