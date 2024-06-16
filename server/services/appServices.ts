import ErrorResponse from '../utils/errorResponse';
import SupabaseService from './supabaseService';

export default class AppServices extends SupabaseService {
  async create(params: { title: string; description?: string }) {
    const apps = await this.client
      .from('apps')
      .insert({
        title: params.title,
        description: params.description,
        user_id: this.user.id,
      })
      .select('*');

    if (apps.error !== null) {
      throw ErrorResponse.supabase(apps.error);
    }

    return apps.data[0];
  }

  async delete(id: string) {
    const apps = await this.client.from('apps').delete().eq('id', id);

    if (apps.error !== null) {
      throw ErrorResponse.supabase(apps.error);
    }

    return null;
  }

  async find(id: string) {
    const apps = await this.client
      .from('apps')
      .select('*')
      .eq('id', id)
      .eq('user_id', this.user.id);

    if (apps.error !== null) {
      throw ErrorResponse.supabase(apps.error);
    }

    if (apps.data.length === 0) {
      throw ErrorResponse.notFound('App does not exist.');
    }

    return apps.data[0];
  }

  async findByTitle(title: string) {
    const app = await this.client
      .from('apps')
      .select('*')
      .eq('title', title)
      .eq('user_id', this.user.id);

    if (app.error !== null) {
      throw ErrorResponse.supabase(app.error);
    }

    return app.data;
  }

  async list() {
    const apps = await this.client
      .from('apps')
      .select('id, title, description, app_keys(api_key)')
      .is('app_keys.deleted_at', null)
      .eq('user_id', this.user.id)
      .order('created_at', { ascending: false });

    if (apps.error !== null) {
      throw ErrorResponse.supabase(apps.error);
    }

    return apps.data;
  }

  async update(params: { id: string; description?: string; title: string }) {
    const payload: { description?: string; title: string } = {
      title: params.title,
    };

    if (params.description) {
      payload.description = params.description;
    }

    const apps = await this.client
      .from('apps')
      .update(payload)
      .eq('id', params.id)
      .eq('user_id', this.user.id)
      .select('*');

    if (apps.error !== null) {
      throw ErrorResponse.supabase(apps.error);
    }

    return apps.data[0];
  }

  /**
   * Creates a new app only if the app's title is unique
   * amongst the user's apps.
   *
   * @param params - the payload for the `create` query method.
   * @returns the new app.
   * @throws Will throw if user is about to exceed the allowed number of apps.
   * @throws Will throw if user already has an app with the same title provided.
   */
  async createUnique(params: {
    title: string;
    description: string | undefined;
  }) {
    const list = await this.list();

    if (list.length === MAX_APPS_ALLOWED) {
      throw ErrorResponse.badRequest(
        'You have exceeded the allowed number of Apps.'
      );
    }

    const matchingNames = list.filter((proj) => proj.title === params.title);

    if (matchingNames.length) {
      throw ErrorResponse.badRequest('App already exists.');
    }

    const created = await this.create({
      title: params.title,
      description: params.description,
    });

    return created;
  }

  /**
   * Updates the app only if the app's title is unique
   * amongst the user's apps.
   *
   * @param params - the payload for the `update` query method
   * @returns the updated app.
   * @throws Will throw if user already has an app with the same title provided.
   */
  async updateUnique(params: {
    id: string;
    description?: string;
    title: string;
  }) {
    const list = await this.findByTitle(params.title);

    if (list.length > 0 && list[0].id !== params.id) {
      throw ErrorResponse.badRequest('App already exists.');
    }

    const updated = await this.update(params);

    return updated;
  }
}
