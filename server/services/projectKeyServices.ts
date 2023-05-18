import { v4 as uuidv4 } from 'uuid';
import ErrorResponse from '../utils/errorResponse';
import SupabaseService from './supabaseService';

export default class ProjectKeyServices extends SupabaseService {
  get table() {
    return 'project_keys';
  }

  async create(params: {
    apiKey: string;
    projectId: string;
    secretKey: string;
  }) {
    const projectKeys = await this.client
      .from(this.table)
      .insert({
        id: uuidv4(),
        api_key: params.apiKey,
        project_id: params.projectId,
        secret_key: params.secretKey,
        user_id: this.user.id,
      })
      .select('*');

    if (projectKeys.error !== null) {
      throw ErrorResponse.supabase(projectKeys.error);
    }

    return projectKeys.data[0];
  }

  async delete(id: string) {
    const projects = await this.client
      .from(this.table)
      .update({
        deleted_at: new Date().toISOString(),
        is_deleted: true,
      })
      .eq('id', id)
      .eq('user_id', this.user.id)
      .select('*');

    if (projects.error !== null) {
      throw ErrorResponse.supabase(projects.error);
    }

    return projects.data[0];
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
