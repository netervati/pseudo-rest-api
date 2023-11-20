import ErrorResponse from '../utils/errorResponse';
import SupabaseService from './supabaseService';

type Schema = { name: string; type: string }[];

export default class ModelServices extends SupabaseService {
  async create(params: { appId: string; name: string; schema: Schema }) {
    const models = await this.client
      .from('models')
      .insert({
        name: params.name,
        schema: params.schema,
        app_id: params.appId,
        user_id: this.user.id,
      })
      .select('*');

    if (models.error !== null) {
      throw ErrorResponse.supabase(models.error);
    }

    return models.data[0];
  }

  async delete(params: { id: string; appId: string }) {
    const model = await this.client
      .from('models')
      .update({
        deleted_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .eq('app_id', params.appId)
      .eq('user_id', this.user.id)
      .select('*');

    if (model.error !== null) {
      throw ErrorResponse.supabase(model.error);
    }

    return model.data[0];
  }

  async find(id: string) {
    const models = await this.client
      .from('models')
      .select('*')
      .is('deleted_at', null)
      .eq('id', id)
      .eq('user_id', this.user.id);

    if (models.error !== null) {
      throw ErrorResponse.supabase(models.error);
    }

    if (models.data.length === 0) {
      throw ErrorResponse.notFound('Model does not exist.');
    }

    return models.data[0];
  }

  async list(appId: string) {
    const models = await this.client
      .from('models')
      .select('id, name, schema')
      .is('deleted_at', null)
      .eq('app_id', appId)
      .eq('user_id', this.user.id)
      .order('created_at', { ascending: false });

    if (models.error !== null) {
      throw ErrorResponse.supabase(models.error);
    }

    return models.data;
  }
}
