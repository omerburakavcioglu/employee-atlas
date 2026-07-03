import type { Database } from "@/lib/database.types";

export type Tables = Database["public"]["Tables"];
export type Views = Database["public"]["Views"];
export type Enums = Database["public"]["Enums"];

export type AppRole = Enums["app_role"];
export type EducationLevel = Enums["education_level"];
export type LanguageProficiency = Enums["language_proficiency"];
export type SkillLevel = Enums["skill_level"];

export type Tenant = Tables["tenants"]["Row"];
export type Profile = Tables["profiles"]["Row"];
export type Location = Tables["locations"]["Row"];
export type Department = Tables["departments"]["Row"];
export type Employee = Tables["employees"]["Row"];
export type Shortlist = Tables["shortlists"]["Row"];
export type FieldVisibility = Tables["field_visibility_settings"]["Row"];

export type LocationWithCount = Views["location_employee_counts"]["Row"];
export type DirectoryEmployee = Views["employee_directory"]["Row"];

export type PastProject = { name: string; role: string; year: number };

export const EDUCATION_LABELS: Record<EducationLevel, string> = {
  high_school: "High school",
  associate: "Associate degree",
  bachelor: "Bachelor's degree",
  master: "Master's degree",
  phd: "PhD",
};

export const PROFICIENCY_LABELS: Record<LanguageProficiency, string> = {
  basic: "Basic",
  conversational: "Conversational",
  professional: "Professional",
  native: "Native",
};

export const ROLE_LABELS: Record<AppRole, string> = {
  super_admin: "Super Admin",
  tenant_admin: "Admin",
  hr: "HR",
  manager: "Manager",
  coordinator: "Technical Coordinator",
};

export function fullName(e: { first_name: string | null; last_name: string | null }) {
  return [e.first_name, e.last_name].filter(Boolean).join(" ");
}

export function initials(e: { first_name: string | null; last_name: string | null }) {
  return `${e.first_name?.[0] ?? ""}${e.last_name?.[0] ?? ""}`.toUpperCase();
}

export function tenure(startDate: string | null): string | null {
  if (!startDate) return null;
  const start = new Date(startDate);
  const now = new Date();
  let months =
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth());
  if (months < 0) months = 0;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (years === 0) return `${rem} mo`;
  if (rem === 0) return `${years} yr${years > 1 ? "s" : ""}`;
  return `${years} yr${years > 1 ? "s" : ""} ${rem} mo`;
}
