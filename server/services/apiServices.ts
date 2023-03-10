import { v4 as uuidv4 } from 'uuid';
import ErrorResponse from '../utils/errorResponse';
import SupabaseService from './supabaseService';

export default class ApiServices extends SupabaseService {
  get table() {
    return 'apis';
  }

  async create(params: {
    description: string | undefined;
    projectId: string;
    urlPath: string;
  }) {
    const apis = await this.client
      .from(this.table)
      .insert({
        id: uuidv4(),
        description: params.description,
        project_id: params.projectId,
        url_path: params.urlPath,
        user_id: this.user.id,
      })
      .select('*');

    if (apis.error !== null) {
      throw ErrorResponse.supabase(apis.error);
    }

    return apis.data[0];
  }

  async findByUrlPath(params: { urlPath: string; projectId: string }) {
    const apis = await this.client
      .from(this.table)
      .select('*')
      .eq('is_deleted', false)
      .eq('url_path', params.urlPath)
      .eq('project_id', params.projectId);

    if (apis.error !== null) {
      throw ErrorResponse.supabase(apis.error);
    }

    return apis.data;
  }
}
