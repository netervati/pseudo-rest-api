import { Database } from './supabase';

type Tables = Database['public']['Tables'];

export type Api = Tables['apis']['Row'];
export type ProjectKey = Tables['project_keys']['Row'];
export type Project = Tables['projects']['Row'];

export type ResourceData = Omit<Tables['resource_data']['Row'], 'data'> & {
  data: { [key: string]: string | number | boolean };
};

export type ResourceModel = Omit<
  Tables['resource_models']['Row'],
  'structure'
> & {
  structure: {
    default: string | number | boolean;
    id: string;
    name: string;
    type: string;
  }[];
};

export type ApiWithResourceModel = Api & {
  resource_models: ResourceModel;
};

export type ProjectKeyWithProject = ProjectKey & {
  projects: Project;
};

export type ProjectWithProjectKey = Project & {
  project_keys: ProjectKey[];
};

// ===================== REVAMP

export type AppKey = Tables['app_keys']['Row'];
export type App = Tables['apps']['Row'];

export type AppWithAppKey = App & {
  app_keys: AppKey[];
};
