import ErrorResponse from '../utils/errorResponse';
import SupabaseService from './supabaseService';

export default class ResourceModelServices extends SupabaseService {
  get table() {
    return 'resource_models';
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
