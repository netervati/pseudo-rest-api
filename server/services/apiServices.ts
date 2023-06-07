import { v4 as uuidv4 } from 'uuid';
import ErrorResponse from '../utils/errorResponse';
import SupabaseService from './supabaseService';

export default class ApiServices extends SupabaseService {
  get table() {
    return 'apis';
  }

  async create(params: {
    description?: string;
    projectId: string;
    resourceModelId: string;
    urlPath: string;
  }) {
    const apis = await this.client
      .from(this.table)
      .insert({
        id: uuidv4(),
        description: params.description,
        project_id: params.projectId,
        resource_model_id: params.resourceModelId,
        url_path: params.urlPath,
        user_id: this.user.id,
      })
      .select('*');

    if (apis.error !== null) {
      throw ErrorResponse.supabase(apis.error);
    }

    return apis.data[0];
  }

  async delete(params: { id: string; projectId: string }) {
    const apis = await this.client
      .from(this.table)
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString().toLocaleString(),
      })
      .eq('id', params.id)
      .eq('project_id', params.projectId)
      .eq('user_id', this.user.id)
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

  async list(projectId: string) {
    const apis = await this.client
      .from(this.table)
      .select(
        'id, description, resource_model_id, url_path, resource_models(name)'
      )
      .eq('is_deleted', false)
      .eq('project_id', projectId)
      .eq('user_id', this.user.id)
      .order('created_at', { ascending: false });

    if (apis.error !== null) {
      throw ErrorResponse.supabase(apis.error);
    }

    return apis.data;
  }

  async update(params: {
    id: string;
    description?: string;
    projectId: string;
    resourceModelId?: string;
    urlPath?: string;
  }) {
    const payload: {
      description?: string;
      resource_model_id?: string;
      url_path?: string;
    } = {};

    if (params.description) {
      payload.description = params.description;
    }

    if (params.urlPath) {
      payload.url_path = params.urlPath;
    }

    if (params.resourceModelId) {
      payload.resource_model_id = params.resourceModelId;
    }

    const apis = await this.client
      .from(this.table)
      .update(payload)
      .eq('id', params.id)
      .eq('project_id', params.projectId)
      .eq('user_id', this.user.id)
      .select('*');

    if (apis.error !== null) {
      throw ErrorResponse.supabase(apis.error);
    }

    return apis.data[0];
  }

  /**
   * Creates a new api endpoint only if the api's url path is unique
   * amongst the user's owned api endpoints.
   *
   * @param params - the payload for the `create` query method.
   * @returns the new api endpoint.
   * @throws Will throw if user is about to exceed the allowed number of api endpoints.
   * @throws Will throw if user already has an api with the same url path provided.
   */
  async createUnique(params: {
    description?: string;
    projectId: string;
    resourceModelId: string;
    urlPath: string;
  }) {
    const list = await this.list(params.projectId);

    if (list.length >= MAX_APIS_ALLOWED) {
      throw ErrorResponse.badRequest(
        'You have exceeded the allowed number of API Endpoints.'
      );
    }

    const matchingUrlPaths = list.filter(
      (apis) => apis.url_path === params.urlPath
    );

    if (matchingUrlPaths.length > 0) {
      throw ErrorResponse.badRequest('API Endpoint already exists.');
    }

    const created = await this.create(params);

    return created;
  }

  /**
   * Updates the api endpoint only if the api's url path is unique
   * amongst the user's owned api endpoints.
   *
   * @param params - the payload for the `update` query method
   * @returns the updated api endpoint.
   * @throws Will throw if user already has an api with the same url path provided.
   */
  async updateUnique(params: {
    id: string;
    description?: string;
    projectId: string;
    resourceModelId?: string;
    urlPath?: string;
  }) {
    if (params.urlPath) {
      const apis = await this.findByUrlPath({
        urlPath: params.urlPath,
        projectId: params.projectId,
      });

      if (apis.length > 0 && apis[0].id !== params.id) {
        throw ErrorResponse.badRequest('API Endpoint already exists.');
      }
    }

    const updated = await this.update(params);

    return updated;
  }
}
