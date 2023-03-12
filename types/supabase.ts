export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      apis: {
        Row: {
          created_at: string
          deleted_at: string | null
          description: string | null
          id: string
          is_deleted: boolean
          project_id: string
          updated_at: string
          url_path: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id: string
          is_deleted?: boolean
          project_id: string
          updated_at?: string
          url_path: string
          user_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_deleted?: boolean
          project_id?: string
          updated_at?: string
          url_path?: string
          user_id?: string
        }
      }
      project_keys: {
        Row: {
          api_key: string
          created_at: string
          deleted_at: string | null
          id: string
          is_deleted: boolean
          project_id: string
          secret_key: string
          updated_at: string
          user_id: string
        }
        Insert: {
          api_key: string
          created_at?: string
          deleted_at?: string | null
          id: string
          is_deleted?: boolean
          project_id: string
          secret_key: string
          updated_at?: string
          user_id: string
        }
        Update: {
          api_key?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_deleted?: boolean
          project_id?: string
          secret_key?: string
          updated_at?: string
          user_id?: string
        }
      }
      projects: {
        Row: {
          created_at: string
          deleted_at: string | null
          description: string | null
          id: string
          is_deleted: boolean
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id: string
          is_deleted?: boolean
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_deleted?: boolean
          name?: string
          updated_at?: string
          user_id?: string
        }
      }
      resource_data: {
        Row: {
          created_at: string
          data: Json | null
          deleted_at: string | null
          id: string
          is_deleted: boolean
          resource_model_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          deleted_at?: string | null
          id: string
          is_deleted?: boolean
          resource_model_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          deleted_at?: string | null
          id?: string
          is_deleted?: boolean
          resource_model_id?: string
          updated_at?: string
          user_id?: string
        }
      }
      resource_models: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          is_deleted: boolean
          name: string
          project_id: string
          structure: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id: string
          is_deleted?: boolean
          name: string
          project_id: string
          structure: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_deleted?: boolean
          name?: string
          project_id?: string
          structure?: Json
          updated_at?: string
          user_id?: string
        }
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
