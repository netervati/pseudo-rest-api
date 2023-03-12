import { Database } from './supabase';

export type Api = Database['public']['Tables']['apis']['Row'];
export type ProjectKey = Database['public']['Tables']['project_keys']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];
export type ResourceData = Database['public']['Tables']['resource_data']['Row'];
export type ResourceModel =
  Database['public']['Tables']['resource_models']['Row'];

export type ProjectKeyWithProject = ProjectKey & {
  projects: Project;
};

export type ProjectWithProjectKey = Project & {
  project_keys: ProjectKey[];
};
