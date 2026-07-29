// Natural-language directory search: turn a free-text query into the same
// DirectoryFilters the filter bar produces. Pure helpers only — the Gemini call
// itself lives in src/lib/actions/ai-search.ts.
//
// Two layers, deliberately: the model proposes filters, and a rule-based parser
// covers the case where there is no API key, no quota, or no network. The demo
// never has to depend on an external service being up.
import type { DirectoryFilters, FilterOptions } from "@/lib/queries/directory";

/** What the model is asked to return. Names and codes only — never database
 * ids, so a hallucinated uuid can't reach a query. "" / 0 mean "not specified";
 * every field is required so the model can't omit one and surprise us. */
export type RawFilters = {
  location_code: string;
  country: string;
  department: string;
  skill: string;
  language: string;
  hobby: string;
  certification: string;
  education: string;
  min_years: number;
  keywords: string;
};

const EDUCATION_KEYS = [
  "high_school",
  "associate",
  "bachelor",
  "master",
  "phd",
] as const;

export const FILTER_JSON_SCHEMA = {
  type: "object",
  properties: {
    location_code: {
      type: "string",
      description: "Location code from the allowed list, or empty string.",
    },
    country: {
      type: "string",
      description: "Country from the allowed list, or empty string.",
    },
    department: {
      type: "string",
      description: "Department name from the allowed list, or empty string.",
    },
    skill: {
      type: "string",
      description: "Skill from the allowed list, or empty string.",
    },
    language: {
      type: "string",
      description: "Language from the allowed list, or empty string.",
    },
    hobby: {
      type: "string",
      description: "Hobby from the allowed list, or empty string.",
    },
    certification: {
      type: "string",
      description: "Certification from the allowed list, or empty string.",
    },
    education: {
      type: "string",
      description: `One of ${EDUCATION_KEYS.join(", ")}, or empty string.`,
    },
    min_years: {
      type: "integer",
      description: "Minimum years of tenure, or 0 if not mentioned.",
    },
    keywords: {
      type: "string",
      description:
        "Leftover free-text terms (job title, name) not covered by any filter above. Empty string if none.",
    },
  },
  required: [
    "location_code",
    "country",
    "department",
    "skill",
    "language",
    "hobby",
    "certification",
    "education",
    "min_years",
    "keywords",
  ],
} as const;

export const SYSTEM_INSTRUCTION = [
  "You convert an HR user's natural-language employee search into structured filters.",
  "The user writes in Turkish or English.",
  "",
  "Rules:",
  "- Only ever use values that appear verbatim in the allowed lists you are given.",
  "- If the user mentions something that is not in a list, leave that field empty and put the term in `keywords` instead.",
  "- Never invent a location, department, skill, language, hobby or certification.",
  "- `min_years` is years of service at the company. Turkish seniority words map roughly: 'kıdemli'/'senior' → 5, 'deneyimli' → 3. Use 0 when tenure is not mentioned.",
  "- Job titles (mühendis, engineer, manager, uzman …) belong in `keywords`, not in `department`, unless they exactly match a department name.",
].join("\n");

/** Only the caller's own tenant vocabulary is ever sent to the model. */
export function buildPrompt(options: FilterOptions, query: string): string {
  const list = (label: string, items: string[]) =>
    items.length ? `${label}: ${items.join(", ")}` : `${label}: (none)`;

  return [
    "Allowed values for this company:",
    list(
      "Locations (use the code)",
      options.locations.map((l) => `${l.code} = ${l.name}, ${l.city}`),
    ),
    list("Countries", options.countries),
    list(
      "Departments",
      options.departments.map((d) => d.name),
    ),
    list("Skills", options.skills),
    list("Languages", options.languages),
    list("Hobbies", options.hobbies),
    list("Certifications", options.certifications),
    "",
    `User query: ${query}`,
  ].join("\n");
}

// ── Whitelist resolution ─────────────────────────────────────
// The model returns names; we resolve them to ids ourselves and drop anything
// that is not in the tenant's own vocabulary. Prompt injection or a
// hallucinated value therefore cannot widen the search.

function findName(allowed: string[], value: string): string | undefined {
  const v = fold(value);
  return v ? allowed.find((a) => fold(a) === v) : undefined;
}

export function resolveFilters(
  raw: Partial<RawFilters>,
  options: FilterOptions,
): DirectoryFilters {
  const filters: DirectoryFilters = {};

  const code = fold(raw.location_code ?? "");
  const location = code
    ? options.locations.find((l) => fold(l.code) === code)
    : undefined;
  if (location) filters.location = location.id;

  // A location already implies its country; models like to fill both in, which
  // would show the user a redundant chip for a filter that narrows nothing.
  const country = findName(options.countries, raw.country ?? "");
  if (country && !filters.location) filters.country = country;

  const deptName = fold(raw.department ?? "");
  const department = deptName
    ? options.departments.find((d) => fold(d.name) === deptName)
    : undefined;
  if (department) filters.department = department.id;

  const skill = findName(options.skills, raw.skill ?? "");
  if (skill) filters.skill = skill;
  const language = findName(options.languages, raw.language ?? "");
  if (language) filters.language = language;
  const hobby = findName(options.hobbies, raw.hobby ?? "");
  if (hobby) filters.hobby = hobby;
  const certification = findName(
    options.certifications,
    raw.certification ?? "",
  );
  if (certification) filters.certification = certification;

  const education = raw.education ?? "";
  if ((EDUCATION_KEYS as readonly string[]).includes(education)) {
    filters.education = education;
  }

  // Drop implausible tenure rather than clamping it: clamping a bogus 999 to 50
  // would silently produce an empty result set instead of ignoring the field.
  const years = Math.round(Number(raw.min_years ?? 0));
  if (Number.isFinite(years) && years > 0 && years <= 50) {
    filters.minYears = years;
  }

  const keywords = (raw.keywords ?? "").trim();
  if (keywords) filters.q = keywords.slice(0, 120);

  return filters;
}

// ── Rule-based fallback ──────────────────────────────────────
// Used when the model is unavailable. Deterministic, offline, no cost.

const TR_FOLD: Record<string, string> = {
  ı: "i", ğ: "g", ü: "u", ş: "s", ö: "o", ç: "c",
  â: "a", î: "i", û: "u",
};

/** Lowercase + strip Turkish diacritics so "İzmir" matches "izmir". */
function fold(value: string): string {
  return value
    .toLocaleLowerCase("tr")
    .replace(/[ıiğüşöçâîû]/g, (c) => TR_FOLD[c] ?? c)
    .trim();
}

/** Longest matching vocabulary entry contained in the query, so
 * "Network Operations" wins over "Network".
 *
 * Entries shorter than 3 characters ("5G", "Go", "C#") must match a whole word
 * — a substring test on those would fire on almost any sentence. */
function matchLongest(
  allowed: string[],
  folded: string,
  words: string[],
): string | undefined {
  let best: string | undefined;
  for (const item of allowed) {
    const f = fold(item);
    if (!f) continue;
    const hit = f.length >= 3 ? folded.includes(f) : words.includes(f);
    if (!hit) continue;
    if (!best || f.length > fold(best).length) best = item;
  }
  return best;
}

// Ordered longest-first: "yuksek lisans" must be tested before "lisans".
const EDUCATION_HINTS: [string, string][] = [
  ["yuksek lisans", "master"],
  ["doktora", "phd"],
  ["onlisans", "associate"],
  ["on lisans", "associate"],
  ["master", "master"],
  ["phd", "phd"],
  ["lisans", "bachelor"],
  ["bachelor", "bachelor"],
  ["lise", "high_school"],
];

export function parseWithRules(
  query: string,
  options: FilterOptions,
): DirectoryFilters {
  const folded = fold(query);
  const filters: DirectoryFilters = {};

  // Word list for short-token matching. Punctuation is stripped so "İzmir'de"
  // yields "izmir" and "5G," yields "5g".
  const words = folded.split(/[^\p{L}\p{N}#+]+/u).filter(Boolean);

  // Match a location by city, by full name, or by the first word of the name
  // ("İzmir Adnan Menderes" → "izmir"), or by its code used as a bare word.
  const tokens = words.filter((t) => t.length >= 3);
  const location = options.locations.find((l) => {
    const name = fold(l.name);
    const head = name.split(/\s+/)[0];
    return (
      folded.includes(fold(l.city)) ||
      folded.includes(name) ||
      tokens.includes(fold(l.code)) ||
      (head.length >= 3 && tokens.includes(head))
    );
  });
  if (location) filters.location = location.id;

  if (!location) {
    const country = matchLongest(options.countries, folded, words);
    if (country) filters.country = country;
  }

  const department = options.departments.find((d) =>
    folded.includes(fold(d.name)),
  );
  if (department) filters.department = department.id;

  const skill = matchLongest(options.skills, folded, words);
  if (skill) filters.skill = skill;
  const language = matchLongest(options.languages, folded, words);
  if (language) filters.language = language;
  const hobby = matchLongest(options.hobbies, folded, words);
  if (hobby) filters.hobby = hobby;
  const certification = matchLongest(options.certifications, folded, words);
  if (certification) filters.certification = certification;

  for (const [hint, level] of EDUCATION_HINTS) {
    if (folded.includes(hint)) {
      filters.education = level;
      break;
    }
  }

  const years = folded.match(/(\d+)\s*(yil|sene|year)/);
  if (years && Number(years[1]) > 0 && Number(years[1]) <= 50)
    filters.minYears = Number(years[1]);
  else if (/kidemli|senior/.test(folded)) filters.minYears = 5;
  else if (/deneyimli/.test(folded)) filters.minYears = 3;

  // Nothing recognized: fall all the way back to keyword search.
  if (Object.keys(filters).length === 0) filters.q = query.trim().slice(0, 120);

  return filters;
}
