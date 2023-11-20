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

  async findByName(params: { name: string; appId: string }) {
    const models = await this.client
      .from('models')
      .select('*')
      .is('deleted_at', null)
      .eq('name', params.name)
      .eq('app_id', params.appId)
      .eq('user_id', this.user.id);

    if (models.error !== null) {
      throw ErrorResponse.supabase(models.error);
    }

    return models.data;
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

  async update(params: {
    id: string;
    appId: string;
    name?: string;
    schema: Schema;
  }) {
    const payload: { name?: string; schema: Schema } = {
      schema: params.schema,
    };

    if (params.name) {
      payload.name = params.name;
    }

    const models = await this.client
      .from('models')
      .update(payload)
      .eq('id', params.id)
      .eq('app_id', params.appId)
      .select('*');

    if (models.error !== null) {
      throw ErrorResponse.supabase(models.error);
    }

    return models.data[0];
  }

  /**
   * Creates a new model only if the model's name is unique
   * amongst the user's owned models.
   *
   * @param params - the payload for the `create` query method.
   * @returns the new model.
   * @throws Will throw if user is about to exceed the allowed number of model.
   * @throws Will throw if user already has a model with the same name provided.
   */
  async createUnique(params: { name: string; appId: string; schema: Schema }) {
    const list = await this.list(params.appId);

    if (list.length >= MAX_RESOURCE_MODELS_ALLOWED) {
      throw ErrorResponse.badRequest(
        'You have exceeded the allowed number of Models.'
      );
    }

    const matchingModels = list.filter((rm) => rm.name === params.name);

    if (matchingModels.length > 0) {
      throw ErrorResponse.badRequest('Model already exists.');
    }

    const created = await this.create(params);

    return created;
  }

  /**
   * Updates the model only if the model's name is unique
   * amongst the user's owned models.
   *
   * @param params - the payload for the `update` query method
   * @returns the updated resource model.
   * @throws Will throw if user already has a resource model with the same name provided.
   */
  async updateUnique(params: {
    id: string;
    appId: string;
    name?: string;
    schema: Schema;
  }) {
    if (params.name) {
      const matchingModels = await this.findByName({
        name: params.name,
        appId: params.appId,
      });

      if (matchingModels.length > 0 && matchingModels[0].id !== params.id) {
        throw ErrorResponse.badRequest('Model already exists.');
      }
    }

    const updated = await this.update(params);

    return updated;
  }
}
