import ErrorResponse from '../utils/errorResponse';
import SupabaseService from './supabaseService';

export default class ProjectKeyServices extends SupabaseService {
  async create(params: { appId: string; apiKey: string; secretKey: string }) {
    const appKeys = await this.client
      .from('app_keys')
      .insert({
        app_id: params.appId,
        api_key: params.apiKey,
        secret_key: params.secretKey,
      })
      .select('*');

    if (appKeys.error !== null) {
      throw ErrorResponse.supabase(appKeys.error);
    }

    return appKeys.data[0];
  }

  async delete(id: string) {
    const projects = await this.client
      .from('app_keys')
      .update({
        deleted_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*');

    if (projects.error !== null) {
      throw ErrorResponse.supabase(projects.error);
    }

    return projects.data[0];
  }

  async findByApiKey(apiKey: string) {
    const appKey = await this.client
      .from('app_keys')
      .select('*')
      .eq('api_key', apiKey)
      .is('deleted_at', null);

    if (appKey.error !== null) {
      throw ErrorResponse.supabase(appKey.error);
    }

    return appKey.data;
  }
}
