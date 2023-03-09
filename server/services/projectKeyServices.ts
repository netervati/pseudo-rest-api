import ErrorResponse from '../utils/errorResponse';
import SupabaseService from './supabaseService';

export default class ProjectKeyServices extends SupabaseService {
  get table() {
    return 'project_keys';
  }

  async create(params: {
    id: string;
    api_key: string;
    project_id: string;
    secret_key: string;
  }) {
    const projectKeys = await this.client
      .from(this.table)
      .insert({ ...params, user_id: this.user.id })
      .select('*');

    if (projectKeys.error !== null) {
      throw ErrorResponse.supabase(projectKeys.error);
    }

    return projectKeys.data[0];
  }

  async findByApiKey(apiKey: string) {
    const projectKey = await this.client
      .from(this.table)
      .select('*')
      .eq('api_key', apiKey)
      .eq('is_deleted', false);

    if (projectKey.error !== null) {
      throw ErrorResponse.supabase(projectKey.error);
    }

    return projectKey.data;
  }
}
