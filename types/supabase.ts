export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
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
          resource_model_id: string
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
          resource_model_id: string
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
          resource_model_id?: string
          updated_at?: string
          url_path?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "apis_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "apis_resource_model_id_fkey"
            columns: ["resource_model_id"]
            isOneToOne: false
            referencedRelation: "resource_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "apis_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      app_keys: {
        Row: {
          app_id: string
          app_key: string
          created_at: string | null
          deleted_at: string | null
          id: string
          secret_key: string
          updated_at: string | null
        }
        Insert: {
          app_id: string
          app_key: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          secret_key: string
          updated_at?: string | null
        }
        Update: {
          app_id?: string
          app_key?: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          secret_key?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_app_id"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "apps"
            referencedColumns: ["id"]
          }
        ]
      }
      apps: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          description: string | null
          id: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "project_keys_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_keys_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: "resource_data_resource_model_id_fkey"
            columns: ["resource_model_id"]
            isOneToOne: false
            referencedRelation: "resource_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resource_data_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "resource_models_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resource_models_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
