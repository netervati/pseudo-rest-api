import ErrorResponse from '../utils/errorResponse';
import SupabaseService from './supabaseService';

type Structure = {
  default: string | number | boolean;
  name: string;
  type: string;
}[];

export default class ResourceModelServices extends SupabaseService {
  get table() {
    return 'resource_models';
  }

  async create(params: {
    id: string;
    name: string;
    structure: Structure;
    project_id: string;
  }) {
    const resourceModels = await this.client
      .from(this.table)
      .insert({ ...params, user_id: this.user.id })
      .select('*');

    if (resourceModels.error !== null) {
      throw ErrorResponse.supabase(resourceModels.error);
    }

    return resourceModels.data[0];
  }

  async findByName(params: { name: string; projectId: string }) {
    const resourceModels = await this.client
      .from(this.table)
      .select('*')
      .eq('is_deleted', false)
      .eq('name', params.name)
      .eq('project_id', params.projectId)
      .eq('user_id', this.user.id);

    if (resourceModels.error !== null) {
      throw ErrorResponse.supabase(resourceModels.error);
    }

    return resourceModels.data;
  }

  async list(projectId: string) {
    const resourceModels = await this.client
      .from(this.table)
      .select('*')
      .eq('is_deleted', false)
      .eq('project_id', projectId)
      .eq('user_id', this.user.id);

    if (resourceModels.error !== null) {
      throw ErrorResponse.supabase(resourceModels.error);
    }

    return resourceModels.data;
  }
}
