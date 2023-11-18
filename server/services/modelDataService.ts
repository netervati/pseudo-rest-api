import ErrorResponse from '../utils/errorResponse';
import SupabaseService from './supabaseService';

type Schema = any;

export default class ModelDataService extends SupabaseService {
  async create(params: { modelId: string; schema: Schema }) {
    const modelData = await this.client
      .from('model_data')
      .insert({
        schema: params.schema,
        model_id: params.modelId,
        user_id: this.user.id,
      })
      .select('*');

    if (modelData.error !== null) {
      throw ErrorResponse.supabase(modelData.error);
    }

    return modelData.data[0];
  }

  async list(modelId: string) {
    const modelData = await this.client
      .from('model_data')
      .select('id, schema')
      .is('deleted_at', null)
      .eq('model_id', modelId)
      .eq('user_id', this.user.id)
      .order('created_at', { ascending: false });

    if (modelData.error !== null) {
      throw ErrorResponse.supabase(modelData.error);
    }

    return modelData.data;
  }
}
