import { Database } from './supabase';

export type Api = Database['public']['Tables']['apis']['Row'];
export type ProjectKey = Database['public']['Tables']['project_keys']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];
