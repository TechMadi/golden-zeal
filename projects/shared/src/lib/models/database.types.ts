export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      directors: {
        Row: {
          bio: string | null
          created_at: string | null
          display_order: number
          hero_image_url: string | null
          id: string
          location: string | null
          name: string
          slug: string
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          display_order?: number
          hero_image_url?: string | null
          id?: string
          location?: string | null
          name: string
          slug: string
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          display_order?: number
          hero_image_url?: string | null
          id?: string
          location?: string | null
          name?: string
          slug?: string
        }
        Relationships: []
      }
      faq: {
        Row: {
          answer: string
          display_order: number
          id: string
          question: string
        }
        Insert: {
          answer: string
          display_order?: number
          id?: string
          question: string
        }
        Update: {
          answer?: string
          display_order?: number
          id?: string
          question?: string
        }
        Relationships: []
      }
      photographers: {
        Row: {
          bio: string | null
          created_at: string | null
          display_order: number
          hero_image_url: string | null
          id: string
          location: string | null
          name: string
          slug: string
          specialty: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          display_order?: number
          hero_image_url?: string | null
          id?: string
          location?: string | null
          name: string
          slug: string
          specialty?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          display_order?: number
          hero_image_url?: string | null
          id?: string
          location?: string | null
          name?: string
          slug?: string
          specialty?: string | null
        }
        Relationships: []
      }
      project_stills: {
        Row: {
          display_order: number
          id: string
          image_url: string
          project_id: string
        }
        Insert: {
          display_order?: number
          id?: string
          image_url: string
          project_id: string
        }
        Update: {
          display_order?: number
          id?: string
          image_url?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_stills_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          category: string
          client: string | null
          created_at: string | null
          director_id: string | null
          display_order: number
          featured: boolean
          id: string
          photographer_id: string | null
          slug: string
          thumbnail_url: string | null
          title: string
          vimeo_id: string | null
          year: number | null
        }
        Insert: {
          category: string
          client?: string | null
          created_at?: string | null
          director_id?: string | null
          display_order?: number
          featured?: boolean
          id?: string
          photographer_id?: string | null
          slug: string
          thumbnail_url?: string | null
          title: string
          vimeo_id?: string | null
          year?: number | null
        }
        Update: {
          category?: string
          client?: string | null
          created_at?: string | null
          director_id?: string | null
          display_order?: number
          featured?: boolean
          id?: string
          photographer_id?: string | null
          slug?: string
          thumbnail_url?: string | null
          title?: string
          vimeo_id?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_director_id_fkey"
            columns: ["director_id"]
            isOneToOne: false
            referencedRelation: "directors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_photographer_id_fkey"
            columns: ["photographer_id"]
            isOneToOne: false
            referencedRelation: "photographers"
            referencedColumns: ["id"]
          },
        ]
      }
      regional_reps: {
        Row: {
          display_order: number
          email: string | null
          id: string
          name: string
          phone: string | null
          region: string
        }
        Insert: {
          display_order?: number
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          region: string
        }
        Update: {
          display_order?: number
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          region?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          description: string | null
          display_order: number
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      showreel: {
        Row: {
          created_at: string | null
          id: string
          thumbnail_url: string | null
          title: string | null
          vimeo_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          thumbnail_url?: string | null
          title?: string | null
          vimeo_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          thumbnail_url?: string | null
          title?: string | null
          vimeo_id?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          value: string
        }
        Insert: {
          key: string
          value: string
        }
        Update: {
          key?: string
          value?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          created_at: string | null
          display_order: number
          email: string | null
          id: string
          is_core: boolean
          location: string | null
          name: string
          photo_url: string | null
          role: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number
          email?: string | null
          id?: string
          is_core?: boolean
          location?: string | null
          name: string
          photo_url?: string | null
          role: string
        }
        Update: {
          created_at?: string | null
          display_order?: number
          email?: string | null
          id?: string
          is_core?: boolean
          location?: string | null
          name?: string
          photo_url?: string | null
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
  public: {
    Enums: {},
  },
} as const
