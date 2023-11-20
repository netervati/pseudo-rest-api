import { Database } from './supabase';

type Tables = Database['public']['Tables'];

export type AppKey = Tables['app_keys']['Row'];
export type App = Tables['apps']['Row'];

export type AppWithAppKey = App & {
  app_keys: AppKey[];
};

export type Model = Tables['models']['Row'];
export type NormalizedModel = Omit<Model, 'schema'> & {
  schema: { name: string; type: string }[];
};

export type ModelData = Tables['model_data']['Row'];
export type NormalizedModelData = Omit<ModelData, 'schema'> & {
  schema: any[];
};
