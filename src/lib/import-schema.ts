import { z } from "zod";

// Expected CSV/Excel column headers for employee import.
export const IMPORT_COLUMNS = [
  "first_name", "last_name", "title", "department", "location_code",
  "email", "phone", "internal_ext", "manager_name", "start_date",
  "education_level", "school", "graduate_info", "skills", "certifications",
  "languages", "hobbies", "expertise_areas", "tools_technologies",
] as const;

export const importRowSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  title: z.string().optional().default(""),
  department: z.string().optional().default(""),
  location_code: z.string().optional().default(""),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional().default(""),
  internal_ext: z.string().optional().default(""),
  manager_name: z.string().optional().default(""),
  start_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
    .optional()
    .or(z.literal("")),
  education_level: z
    .enum(["high_school", "associate", "bachelor", "master", "phd"])
    .optional()
    .or(z.literal("")),
  school: z.string().optional().default(""),
  graduate_info: z.string().optional().default(""),
  skills: z.string().optional().default(""),
  certifications: z.string().optional().default(""),
  languages: z.string().optional().default(""),
  hobbies: z.string().optional().default(""),
  expertise_areas: z.string().optional().default(""),
  tools_technologies: z.string().optional().default(""),
});

export type ImportRow = z.infer<typeof importRowSchema>;
