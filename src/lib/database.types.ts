export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity: string
          entity_id: string | null
          id: string
          meta: Json
          tenant_id: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity: string
          entity_id?: string | null
          id?: string
          meta?: Json
          tenant_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity?: string
          entity_id?: string | null
          id?: string
          meta?: Json
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "audit_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      certifications: {
        Row: {
          id: string
          name: string
          tenant_id: string
        }
        Insert: {
          id?: string
          name: string
          tenant_id: string
        }
        Update: {
          id?: string
          name?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certifications_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          created_at: string
          id: string
          name: string
          parent_department_id: string | null
          tenant_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          parent_department_id?: string | null
          tenant_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          parent_department_id?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "departments_parent_department_id_fkey"
            columns: ["parent_department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "departments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_certifications: {
        Row: {
          certification_id: string
          employee_id: string
          issued_year: number | null
        }
        Insert: {
          certification_id: string
          employee_id: string
          issued_year?: number | null
        }
        Update: {
          certification_id?: string
          employee_id?: string
          issued_year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_certifications_certification_id_fkey"
            columns: ["certification_id"]
            isOneToOne: false
            referencedRelation: "certifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_certifications_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_directory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_certifications_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_hobbies: {
        Row: {
          employee_id: string
          hobby_id: string
        }
        Insert: {
          employee_id: string
          hobby_id: string
        }
        Update: {
          employee_id?: string
          hobby_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_hobbies_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_directory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_hobbies_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_hobbies_hobby_id_fkey"
            columns: ["hobby_id"]
            isOneToOne: false
            referencedRelation: "hobbies"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_languages: {
        Row: {
          employee_id: string
          language_id: string
          proficiency: Database["public"]["Enums"]["language_proficiency"]
        }
        Insert: {
          employee_id: string
          language_id: string
          proficiency?: Database["public"]["Enums"]["language_proficiency"]
        }
        Update: {
          employee_id?: string
          language_id?: string
          proficiency?: Database["public"]["Enums"]["language_proficiency"]
        }
        Relationships: [
          {
            foreignKeyName: "employee_languages_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_directory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_languages_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_languages_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_skills: {
        Row: {
          employee_id: string
          level: Database["public"]["Enums"]["skill_level"] | null
          skill_id: string
        }
        Insert: {
          employee_id: string
          level?: Database["public"]["Enums"]["skill_level"] | null
          skill_id: string
        }
        Update: {
          employee_id?: string
          level?: Database["public"]["Enums"]["skill_level"] | null
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_skills_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_directory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_skills_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          created_at: string
          department_id: string | null
          education_level: Database["public"]["Enums"]["education_level"] | null
          email: string | null
          expertise_areas: string[]
          first_name: string
          graduate_info: string | null
          id: string
          internal_ext: string | null
          last_name: string
          location_id: string | null
          manager_name: string | null
          past_projects: Json
          phone: string | null
          photo_url: string | null
          school: string | null
          start_date: string | null
          tenant_id: string
          title: string
          tools_technologies: string[]
          updated_at: string
        }
        Insert: {
          created_at?: string
          department_id?: string | null
          education_level?:
            | Database["public"]["Enums"]["education_level"]
            | null
          email?: string | null
          expertise_areas?: string[]
          first_name: string
          graduate_info?: string | null
          id?: string
          internal_ext?: string | null
          last_name: string
          location_id?: string | null
          manager_name?: string | null
          past_projects?: Json
          phone?: string | null
          photo_url?: string | null
          school?: string | null
          start_date?: string | null
          tenant_id: string
          title?: string
          tools_technologies?: string[]
          updated_at?: string
        }
        Update: {
          created_at?: string
          department_id?: string | null
          education_level?:
            | Database["public"]["Enums"]["education_level"]
            | null
          email?: string | null
          expertise_areas?: string[]
          first_name?: string
          graduate_info?: string | null
          id?: string
          internal_ext?: string | null
          last_name?: string
          location_id?: string | null
          manager_name?: string | null
          past_projects?: Json
          phone?: string | null
          photo_url?: string | null
          school?: string | null
          start_date?: string | null
          tenant_id?: string
          title?: string
          tools_technologies?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employees_department_id_tenant_id_fkey"
            columns: ["department_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id", "tenant_id"]
          },
          {
            foreignKeyName: "employees_location_id_tenant_id_fkey"
            columns: ["location_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "location_employee_counts"
            referencedColumns: ["id", "tenant_id"]
          },
          {
            foreignKeyName: "employees_location_id_tenant_id_fkey"
            columns: ["location_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id", "tenant_id"]
          },
          {
            foreignKeyName: "employees_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      field_visibility_settings: {
        Row: {
          field_key: string
          tenant_id: string
          updated_at: string
          visible_to_roles: Database["public"]["Enums"]["app_role"][]
        }
        Insert: {
          field_key: string
          tenant_id: string
          updated_at?: string
          visible_to_roles?: Database["public"]["Enums"]["app_role"][]
        }
        Update: {
          field_key?: string
          tenant_id?: string
          updated_at?: string
          visible_to_roles?: Database["public"]["Enums"]["app_role"][]
        }
        Relationships: [
          {
            foreignKeyName: "field_visibility_settings_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      hobbies: {
        Row: {
          id: string
          name: string
          tenant_id: string
        }
        Insert: {
          id?: string
          name: string
          tenant_id: string
        }
        Update: {
          id?: string
          name?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hobbies_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      languages: {
        Row: {
          id: string
          name: string
          tenant_id: string
        }
        Insert: {
          id?: string
          name: string
          tenant_id: string
        }
        Update: {
          id?: string
          name?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "languages_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          city: string
          code: string
          country: string
          created_at: string
          id: string
          lat: number
          lng: number
          name: string
          tenant_id: string
          type: Database["public"]["Enums"]["location_type"]
          updated_at: string
        }
        Insert: {
          city: string
          code: string
          country: string
          created_at?: string
          id?: string
          lat: number
          lng: number
          name: string
          tenant_id: string
          type?: Database["public"]["Enums"]["location_type"]
          updated_at?: string
        }
        Update: {
          city?: string
          code?: string
          country?: string
          created_at?: string
          id?: string
          lat?: number
          lng?: number
          name?: string
          tenant_id?: string
          type?: Database["public"]["Enums"]["location_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "locations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          role: Database["public"]["Enums"]["app_role"]
          tenant_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          full_name?: string
          role?: Database["public"]["Enums"]["app_role"]
          tenant_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          full_name?: string
          role?: Database["public"]["Enums"]["app_role"]
          tenant_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      shortlist_employees: {
        Row: {
          added_at: string
          employee_id: string
          shortlist_id: string
          tenant_id: string
        }
        Insert: {
          added_at?: string
          employee_id: string
          shortlist_id: string
          tenant_id: string
        }
        Update: {
          added_at?: string
          employee_id?: string
          shortlist_id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shortlist_employees_employee_id_tenant_id_fkey"
            columns: ["employee_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "employee_directory"
            referencedColumns: ["id", "tenant_id"]
          },
          {
            foreignKeyName: "shortlist_employees_employee_id_tenant_id_fkey"
            columns: ["employee_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id", "tenant_id"]
          },
          {
            foreignKeyName: "shortlist_employees_shortlist_id_tenant_id_fkey"
            columns: ["shortlist_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "shortlists"
            referencedColumns: ["id", "tenant_id"]
          },
          {
            foreignKeyName: "shortlist_employees_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      shortlists: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          name: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          name: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shortlists_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "shortlists_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category: string | null
          id: string
          name: string
          tenant_id: string
        }
        Insert: {
          category?: string | null
          id?: string
          name: string
          tenant_id: string
        }
        Update: {
          category?: string | null
          id?: string
          name?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "skills_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          accent_color: string
          background_color: string
          created_at: string
          display_name: string
          id: string
          industry: string
          logo_url: string | null
          name: string
          primary_color: string
          secondary_color: string
          slug: string
          text_color: string
          theme_config: Json
          updated_at: string
        }
        Insert: {
          accent_color?: string
          background_color?: string
          created_at?: string
          display_name: string
          id?: string
          industry?: string
          logo_url?: string | null
          name: string
          primary_color?: string
          secondary_color?: string
          slug: string
          text_color?: string
          theme_config?: Json
          updated_at?: string
        }
        Update: {
          accent_color?: string
          background_color?: string
          created_at?: string
          display_name?: string
          id?: string
          industry?: string
          logo_url?: string | null
          name?: string
          primary_color?: string
          secondary_color?: string
          slug?: string
          text_color?: string
          theme_config?: Json
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      employee_directory: {
        Row: {
          certification_names: string[] | null
          created_at: string | null
          department_id: string | null
          department_name: string | null
          education_level: Database["public"]["Enums"]["education_level"] | null
          email: string | null
          expertise_areas: string[] | null
          first_name: string | null
          graduate_info: string | null
          hobby_names: string[] | null
          id: string | null
          internal_ext: string | null
          language_names: string[] | null
          last_name: string | null
          location_city: string | null
          location_code: string | null
          location_country: string | null
          location_id: string | null
          location_name: string | null
          manager_name: string | null
          past_projects: Json | null
          phone: string | null
          photo_url: string | null
          school: string | null
          skill_names: string[] | null
          start_date: string | null
          tenant_id: string | null
          title: string | null
          tools_technologies: string[] | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_department_id_tenant_id_fkey"
            columns: ["department_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id", "tenant_id"]
          },
          {
            foreignKeyName: "employees_location_id_tenant_id_fkey"
            columns: ["location_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "location_employee_counts"
            referencedColumns: ["id", "tenant_id"]
          },
          {
            foreignKeyName: "employees_location_id_tenant_id_fkey"
            columns: ["location_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id", "tenant_id"]
          },
          {
            foreignKeyName: "employees_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      location_employee_counts: {
        Row: {
          city: string | null
          code: string | null
          country: string | null
          created_at: string | null
          employee_count: number | null
          id: string | null
          lat: number | null
          lng: number | null
          name: string | null
          tenant_id: string | null
          type: Database["public"]["Enums"]["location_type"] | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      current_app_role: {
        Args: never
        Returns: Database["public"]["Enums"]["app_role"]
      }
      current_tenant_id: { Args: never; Returns: string }
      is_super_admin: { Args: never; Returns: boolean }
      is_tenant_staff: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "tenant_admin"
        | "hr"
        | "manager"
        | "coordinator"
      education_level:
        | "high_school"
        | "associate"
        | "bachelor"
        | "master"
        | "phd"
      language_proficiency:
        | "basic"
        | "conversational"
        | "professional"
        | "native"
      location_type: "airport" | "office" | "hq" | "campus" | "datacenter"
      skill_level: "beginner" | "intermediate" | "advanced" | "expert"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      app_role: ["super_admin", "tenant_admin", "hr", "manager", "coordinator"],
      education_level: [
        "high_school",
        "associate",
        "bachelor",
        "master",
        "phd",
      ],
      language_proficiency: [
        "basic",
        "conversational",
        "professional",
        "native",
      ],
      location_type: ["airport", "office", "hq", "campus", "datacenter"],
      skill_level: ["beginner", "intermediate", "advanced", "expert"],
    },
  },
} as const

