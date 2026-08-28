// apps/api/src/llm/prompt-parser.ts
//
// Traduce un prompt en lenguaje natural a SearchFilters, usando el tool
// definido en filter-schema.ts. Es el único módulo que sabe CÓMO se le
// pide a Claude que extraiga filtros — search.service.ts solo consume
// el resultado ya tipado, sin saber nada de la API de Anthropic.

import Anthropic from "@anthropic-ai/sdk";
import { claudeClient, FILTER_MODEL } from "./claude-client.js";
import { extractFiltersTool } from "./filter-schema.js";

export class FilterParseError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "FilterParseError";
  }
}
