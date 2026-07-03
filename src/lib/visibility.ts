import type { AppRole, FieldVisibility } from "@/lib/types";

// Profile field groups whose visibility admins/HR can restrict per role.
export const VISIBILITY_FIELDS = [
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "internal_ext", label: "Internal extension" },
  { key: "manager_name", label: "Manager" },
  { key: "start_date", label: "Start date & tenure" },
  { key: "education", label: "Education" },
  { key: "certifications", label: "Certifications" },
  { key: "languages", label: "Languages" },
  { key: "past_projects", label: "Past projects" },
  { key: "hobbies", label: "Hobbies" },
] as const;

export type VisibilityFieldKey = (typeof VISIBILITY_FIELDS)[number]["key"];

export type VisibleFields = Record<VisibilityFieldKey, boolean>;

export function computeVisibleFields(
  settings: Pick<FieldVisibility, "field_key" | "visible_to_roles">[],
  role: AppRole,
): VisibleFields {
  const map = new Map(settings.map((s) => [s.field_key, s.visible_to_roles]));
  return Object.fromEntries(
    VISIBILITY_FIELDS.map(({ key }) => {
      const roles = map.get(key);
      // Unconfigured fields default to visible.
      return [key, roles ? roles.includes(role) : true];
    }),
  ) as VisibleFields;
}
