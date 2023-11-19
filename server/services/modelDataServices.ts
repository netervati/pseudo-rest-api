import ErrorResponse from '../utils/errorResponse';
import SupabaseService from './supabaseService';

type Schema = {
  name: string;
  type: string
};

export default class ModelDataService extends SupabaseService {
  async bulkCreate(params: { data: Schema[]; modelId: string }) {
    return await Promise.all(
      params.data.map((schema) => {
        return this.client
          .from('model_data')
          .insert({
            schema,
            model_id: params.modelId,
            user_id: this.user.id,
          })
          .select('*');
      })
    );
  }

  async count(modelId: string) {
    const modelData = await this.client
      .from('model_data')
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null)
      .eq('model_id', modelId)
      .order('created_at', { ascending: false });

    if (modelData.error !== null) {
      throw ErrorResponse.supabase(modelData.error);
    }

    return modelData.count ?? 0;
  }

  async list(modelId: string) {
    const modelData = await this.client
      .from('model_data')
      .select('id, schema')
      .is('deleted_at', null)
      .eq('model_id', modelId)
      .order('created_at', { ascending: false });

    if (modelData.error !== null) {
      throw ErrorResponse.supabase(modelData.error);
    }

    return modelData.data;
  }
}
