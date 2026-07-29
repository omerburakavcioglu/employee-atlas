"use server";

import "server-only";
import { GoogleGenAI } from "@google/genai";
import { getFilterOptions, type DirectoryFilters } from "@/lib/queries/directory";
import { getSessionProfile } from "@/lib/queries/session";
import {
  buildPrompt,
  FILTER_JSON_SCHEMA,
  parseWithRules,
  resolveFilters,
  SYSTEM_INSTRUCTION,
  type RawFilters,
} from "@/lib/ai/query-parser";

// Free-tier model; see https://ai.google.dev/gemini-api/docs/pricing
// flash-lite measured ~2.4s vs ~6s for gemini-3.6-flash on this prompt, with
// identical filter output across the test queries — latency matters more than
// headroom for a search box.
const MODEL = "gemini-3.5-flash-lite";

export type SmartSearchResult = {
  filters: DirectoryFilters;
  /** Which layer produced the filters — surfaced in the UI so the user knows. */
  source: "ai" | "rules";
  error: string | null;
};

/**
 * Turn a natural-language query into directory filters.
 *
 * The model only ever sees the caller's own tenant vocabulary (via the
 * tenant-scoped getFilterOptions) and only ever returns filter values — it has
 * no access to employee data. Everything it returns is re-checked against that
 * same vocabulary in resolveFilters before it can reach a query, and the search
 * itself still runs through RLS + explicit tenant scoping.
 */
export async function smartSearch(query: string): Promise<SmartSearchResult> {
  // A Server Action is a public POST endpoint: authenticate here, not in the UI.
  await getSessionProfile();

  const trimmed = query.trim().slice(0, 300);
  if (!trimmed) return { filters: {}, source: "rules", error: null };

  const options = await getFilterOptions();

  if (!process.env.GEMINI_API_KEY) {
    return { filters: parseWithRules(trimmed, options), source: "rules", error: null };
  }

  try {
    const ai = new GoogleGenAI({});
    const interaction = await ai.interactions.create({
      model: MODEL,
      system_instruction: SYSTEM_INSTRUCTION,
      input: buildPrompt(options, trimmed),
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: FILTER_JSON_SCHEMA,
      },
    });

    const text = interaction.output_text;
    if (!text) throw new Error("Empty response from model");
    const raw = JSON.parse(text) as Partial<RawFilters>;

    return { filters: resolveFilters(raw, options), source: "ai", error: null };
  } catch (error) {
    // Quota, network, malformed JSON — the feature still works, just deterministically.
    console.error("smartSearch: falling back to rule-based parser", error);
    return {
      filters: parseWithRules(trimmed, options),
      source: "rules",
      error: "AI servisine ulaşılamadı — kural tabanlı arama kullanıldı.",
    };
  }
}
