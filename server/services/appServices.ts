import ErrorResponse from '../utils/errorResponse';
import SupabaseService from './supabaseService';

export default class AppServices extends SupabaseService {
  async create(params: {
    title: string;
    description?: string;
  }) {
    const apps = await this.client
      .from('apps')
      .insert({
        title: params.title,
        description: params.description,
        user_id: this.user.id,
      })
      .select('*');

    if (apps.error !== null) {
      console.log(apps.error);
      throw ErrorResponse.supabase(apps.error);
    }

    return apps.data[0];
  }

  async list() {
    const apps = await this.client
      .from('apps')
      .select('id, title, description, app_keys(app_key)')
      .is('deleted_at', null)
      .is('app_keys.deleted_at', null)
      .eq('user_id', this.user.id)
      .order('created_at', { ascending: false });

    if (apps.error !== null) {
      console.log(apps.error);
      throw ErrorResponse.supabase(apps.error);
    }

    return apps.data;
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

    if (list.length === MAX_PROJECTS_ALLOWED) {
      throw ErrorResponse.badRequest(
        'You have exceeded the allowed number of Projects.'
      );
    }

    const matchingNames = list.filter((proj) => proj.title === params.title);

    if (matchingNames.length) {
      throw ErrorResponse.badRequest('Project already exists.');
    }

    const created = await this.create({
      title: params.title,
      description: params.description,
    });

    return created;
  }
}
