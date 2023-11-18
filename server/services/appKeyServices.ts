import ErrorResponse from '../utils/errorResponse';
import SupabaseService from './supabaseService';

export default class ProjectKeyServices extends SupabaseService {
  async create(params: { appId: string; appKey: string; secretKey: string }) {
    const appKeys = await this.client
      .from('app_keys')
      .insert({
        app_id: params.appId,
        app_key: params.appKey,
        secret_key: params.secretKey,
      })
      .select('*');

    if (appKeys.error !== null) {
      throw ErrorResponse.supabase(appKeys.error);
    }

    return appKeys.data[0];
  }
}
