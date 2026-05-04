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
      error_reports: {
        Row: {
          created_at: string
          description: string
          id: string
          related_content_id: string | null
          related_content_type: string | null
          reported_by: string | null
          status: Database["public"]["Enums"]["report_status"]
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          related_content_id?: string | null
          related_content_type?: string | null
          reported_by?: string | null
          status?: Database["public"]["Enums"]["report_status"]
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          related_content_id?: string | null
          related_content_type?: string | null
          reported_by?: string | null
          status?: Database["public"]["Enums"]["report_status"]
        }
        Relationships: [
          {
            foreignKeyName: "error_reports_reported_by_fkey"
            columns: ["reported_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      homework_submissions: {
        Row: {
          ai_feedback: string | null
          ai_score: number | null
          answers: Json | null
          file_url: string | null
          homework_id: string
          id: string
          status: Database["public"]["Enums"]["submission_status"]
          student_id: string
          submitted_at: string
          teacher_feedback: string | null
          teacher_score: number | null
        }
        Insert: {
          ai_feedback?: string | null
          ai_score?: number | null
          answers?: Json | null
          file_url?: string | null
          homework_id: string
          id?: string
          status?: Database["public"]["Enums"]["submission_status"]
          student_id: string
          submitted_at?: string
          teacher_feedback?: string | null
          teacher_score?: number | null
        }
        Update: {
          ai_feedback?: string | null
          ai_score?: number | null
          answers?: Json | null
          file_url?: string | null
          homework_id?: string
          id?: string
          status?: Database["public"]["Enums"]["submission_status"]
          student_id?: string
          submitted_at?: string
          teacher_feedback?: string | null
          teacher_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "homework_submissions_homework_id_fkey"
            columns: ["homework_id"]
            isOneToOne: false
            referencedRelation: "homeworks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "homework_submissions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      homeworks: {
        Row: {
          created_at: string
          deadline: string | null
          description_en: string | null
          description_kz: string | null
          difficulty_distribution: Json | null
          id: string
          is_published: boolean
          lesson_id: string | null
          questions: Json | null
          subject_en: string
          subject_kz: string
          subject_slug: string
          title_en: string
          title_kz: string
          type: Database["public"]["Enums"]["homework_type"]
        }
        Insert: {
          created_at?: string
          deadline?: string | null
          description_en?: string | null
          description_kz?: string | null
          difficulty_distribution?: Json | null
          id?: string
          is_published?: boolean
          lesson_id?: string | null
          questions?: Json | null
          subject_en: string
          subject_kz: string
          subject_slug: string
          title_en: string
          title_kz: string
          type?: Database["public"]["Enums"]["homework_type"]
        }
        Update: {
          created_at?: string
          deadline?: string | null
          description_en?: string | null
          description_kz?: string | null
          difficulty_distribution?: Json | null
          id?: string
          is_published?: boolean
          lesson_id?: string | null
          questions?: Json | null
          subject_en?: string
          subject_kz?: string
          subject_slug?: string
          title_en?: string
          title_kz?: string
          type?: Database["public"]["Enums"]["homework_type"]
        }
        Relationships: [
          {
            foreignKeyName: "homeworks_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_schedule: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          is_released: boolean
          lesson_id: string
          release_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_released?: boolean
          lesson_id: string
          release_at: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_released?: boolean
          lesson_id?: string
          release_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_schedule_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_schedule_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          created_at: string
          created_by: string | null
          description_en: string | null
          description_kz: string | null
          duration_seconds: number | null
          id: string
          is_published: boolean
          order_index: number | null
          release_at: string | null
          subject_en: string
          subject_kz: string
          subject_slug: string
          thumbnail_url: string | null
          topic_en: string
          topic_kz: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description_en?: string | null
          description_kz?: string | null
          duration_seconds?: number | null
          id?: string
          is_published?: boolean
          order_index?: number | null
          release_at?: string | null
          subject_en: string
          subject_kz: string
          subject_slug: string
          thumbnail_url?: string | null
          topic_en: string
          topic_kz: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description_en?: string | null
          description_kz?: string | null
          duration_seconds?: number | null
          id?: string
          is_published?: boolean
          order_index?: number | null
          release_at?: string | null
          subject_en?: string
          subject_kz?: string
          subject_slug?: string
          thumbnail_url?: string | null
          topic_en?: string
          topic_kz?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      nusqa_sessions: {
        Row: {
          created_at: string
          description_en: string | null
          description_kz: string | null
          id: string
          max_students: number | null
          scheduled_at: string
          status: Database["public"]["Enums"]["session_status"]
          test_id: string | null
          title_en: string
          title_kz: string
        }
        Insert: {
          created_at?: string
          description_en?: string | null
          description_kz?: string | null
          id?: string
          max_students?: number | null
          scheduled_at: string
          status?: Database["public"]["Enums"]["session_status"]
          test_id?: string | null
          title_en: string
          title_kz: string
        }
        Update: {
          created_at?: string
          description_en?: string | null
          description_kz?: string | null
          id?: string
          max_students?: number | null
          scheduled_at?: string
          status?: Database["public"]["Enums"]["session_status"]
          test_id?: string | null
          title_en?: string
          title_kz?: string
        }
        Relationships: [
          {
            foreignKeyName: "nusqa_sessions_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          language: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          language?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          language?: string
          updated_at?: string
        }
        Relationships: []
      }
      student_profiles: {
        Row: {
          created_at: string
          id: string
          onboarded: boolean
          score_math_saattylyghy: number
          score_oku_saattylyghy: number
          score_qazaqstan_tarihy: number
          score_subject_1: number
          score_subject_2: number
          subject_pair_id: number | null
          subscription_tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          onboarded?: boolean
          score_math_saattylyghy?: number
          score_oku_saattylyghy?: number
          score_qazaqstan_tarihy?: number
          score_subject_1?: number
          score_subject_2?: number
          subject_pair_id?: number | null
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          onboarded?: boolean
          score_math_saattylyghy?: number
          score_oku_saattylyghy?: number
          score_qazaqstan_tarihy?: number
          score_subject_1?: number
          score_subject_2?: number
          subject_pair_id?: number | null
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_profiles_subject_pair_id_fkey"
            columns: ["subject_pair_id"]
            isOneToOne: false
            referencedRelation: "subject_pairs"
            referencedColumns: ["id"]
          },
        ]
      }
      study_notes: {
        Row: {
          content_en: string | null
          content_kz: string | null
          created_at: string
          id: string
          lesson_id: string | null
          pdf_url: string | null
          title_en: string
          title_kz: string
        }
        Insert: {
          content_en?: string | null
          content_kz?: string | null
          created_at?: string
          id?: string
          lesson_id?: string | null
          pdf_url?: string | null
          title_en: string
          title_kz: string
        }
        Update: {
          content_en?: string | null
          content_kz?: string | null
          created_at?: string
          id?: string
          lesson_id?: string | null
          pdf_url?: string | null
          title_en?: string
          title_kz?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_notes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      subject_pairs: {
        Row: {
          id: number
          name_en: string
          name_kz: string
          subject_1_en: string
          subject_1_kz: string
          subject_2_en: string | null
          subject_2_kz: string | null
        }
        Insert: {
          id?: number
          name_en: string
          name_kz: string
          subject_1_en: string
          subject_1_kz: string
          subject_2_en?: string | null
          subject_2_kz?: string | null
        }
        Update: {
          id?: number
          name_en?: string
          name_kz?: string
          subject_1_en?: string
          subject_1_kz?: string
          subject_2_en?: string | null
          subject_2_kz?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          expires_at: string | null
          id: string
          plan: string
          price_kzt: number
          started_at: string
          status: string
          student_id: string
        }
        Insert: {
          expires_at?: string | null
          id?: string
          plan?: string
          price_kzt?: number
          started_at?: string
          status?: string
          student_id: string
        }
        Update: {
          expires_at?: string | null
          id?: string
          plan?: string
          price_kzt?: number
          started_at?: string
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      test_results: {
        Row: {
          answers: Json | null
          id: string
          max_score: number
          predicted_unt_score: number | null
          score: number
          student_id: string
          taken_at: string
          test_id: string
          weak_topics: Json | null
        }
        Insert: {
          answers?: Json | null
          id?: string
          max_score?: number
          predicted_unt_score?: number | null
          score?: number
          student_id: string
          taken_at?: string
          test_id: string
          weak_topics?: Json | null
        }
        Update: {
          answers?: Json | null
          id?: string
          max_score?: number
          predicted_unt_score?: number | null
          score?: number
          student_id?: string
          taken_at?: string
          test_id?: string
          weak_topics?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "test_results_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_results_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      tests: {
        Row: {
          created_at: string
          id: string
          is_published: boolean
          questions: Json
          subject_en: string
          subject_kz: string
          subject_slug: string
          time_limit_minutes: number
          title_en: string
          title_kz: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_published?: boolean
          questions?: Json
          subject_en: string
          subject_kz: string
          subject_slug: string
          time_limit_minutes?: number
          title_en: string
          title_kz: string
        }
        Update: {
          created_at?: string
          id?: string
          is_published?: boolean
          questions?: Json
          subject_en?: string
          subject_kz?: string
          subject_slug?: string
          time_limit_minutes?: number
          title_en?: string
          title_kz?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_role: {
        Args: never
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      promote_user_by_email: {
        Args: { _email: string; _role: Database["public"]["Enums"]["app_role"] }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "student" | "teacher" | "admin"
      homework_type: "test" | "file"
      report_status: "open" | "resolved"
      session_status: "upcoming" | "live" | "ended"
      submission_status: "pending" | "graded" | "reviewed"
      subscription_tier: "free" | "premium"
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
    Enums: {
      app_role: ["student", "teacher", "admin"],
      homework_type: ["test", "file"],
      report_status: ["open", "resolved"],
      session_status: ["upcoming", "live", "ended"],
      submission_status: ["pending", "graded", "reviewed"],
      subscription_tier: ["free", "premium"],
    },
  },
} as const
