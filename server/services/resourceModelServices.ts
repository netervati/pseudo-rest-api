import { v4 as uuidv4 } from 'uuid';
import ErrorResponse from '../utils/errorResponse';
import SupabaseService from './supabaseService';

type Structure = {
  default: string | number | boolean;
  name: string;
  type: string;
}[];

export default class ResourceModelServices extends SupabaseService {
  get table() {
    return 'resource_models';
  }

  async create(params: {
    name: string;
    projectId: string;
    structure: Structure;
  }) {
    const resourceModels = await this.client
      .from(this.table)
      .insert({
        id: uuidv4(),
        name: params.name,
        structure: params.structure,
        project_id: params.projectId,
        user_id: this.user.id,
      })
      .select('*');

    if (resourceModels.error !== null) {
      throw ErrorResponse.supabase(resourceModels.error);
    }

    return resourceModels.data[0];
  }

  async delete(params: { id: string; projectId: string }) {
    const resourceModel = await this.client
      .from(this.table)
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString().toLocaleString(),
      })
      .eq('id', params.id)
      .eq('project_id', params.projectId)
      .eq('user_id', this.user.id)
      .select('*');

    if (resourceModel.error !== null) {
      throw ErrorResponse.supabase(resourceModel.error);
    }

    return resourceModel.data[0];
  }

  async findByName(params: { name: string; projectId: string }) {
    const resourceModels = await this.client
      .from(this.table)
      .select('*')
      .eq('is_deleted', false)
      .eq('name', params.name)
      .eq('project_id', params.projectId)
      .eq('user_id', this.user.id);

    if (resourceModels.error !== null) {
      throw ErrorResponse.supabase(resourceModels.error);
    }

    return resourceModels.data;
  }

  async find(id: string) {
    const resourceModel = await this.client
      .from(this.table)
      .select('*')
      .eq('id', id);

    if (resourceModel.error !== null) {
      throw ErrorResponse.supabase(resourceModel.error);
    }

    if (resourceModel.data.length === 0) {
      throw ErrorResponse.badRequest('Resource model does not exist.');
    }

    return resourceModel.data[0];
  }

  async list(projectId: string) {
    const resourceModels = await this.client
      .from(this.table)
      .select('*')
      .eq('is_deleted', false)
      .eq('project_id', projectId)
      .eq('user_id', this.user.id)
      .order('created_at', { ascending: false });

    if (resourceModels.error !== null) {
      throw ErrorResponse.supabase(resourceModels.error);
    }

    return resourceModels.data;
  }

  async update(params: {
    id: string;
    name?: string;
    projectId: string;
    structure: Structure;
  }) {
    const payload: { name?: string; structure: Structure } = {
      structure: params.structure,
    };

    if (params.name) {
      payload.name = params.name;
    }

    const resourceModels = await this.client
      .from(this.table)
      .update(payload)
      .eq('id', params.id)
      .eq('project_id', params.projectId)
      .select('*');

    if (resourceModels.error !== null) {
      throw ErrorResponse.supabase(resourceModels.error);
    }

    return resourceModels.data[0];
  }

  /**
   * Creates a new resource model only if the resource model's name is unique
   * amongst the user's owned resource models.
   *
   * @param params - the payload for the `create` query method.
   * @returns the new resource model.
   * @throws Will throw if user is about to exceed the allowed number of resource model.
   * @throws Will throw if user already has a resource model with the same name provided.
   */
  async createUnique(params: {
    name: string;
    projectId: string;
    structure: Structure;
  }) {
    const list = await this.list(params.projectId);

    if (list.length >= MAX_RESOURCE_MODELS_ALLOWED) {
      throw ErrorResponse.badRequest(
        'You have exceeded the allowed number of Resource Models.'
      );
    }

    const matchingResourceModels = list.filter((rm) => rm.name === params.name);

    if (matchingResourceModels.length > 0) {
      throw ErrorResponse.badRequest('Resource model already exists.');
    }

    const created = await this.create(params);

    return created;
  }

  /**
   * Updates the resource model only if the resource model's name is unique
   * amongst the user's owned resource models.
   *
   * @param params - the payload for the `update` query method
   * @returns the updated resource model.
   * @throws Will throw if user already has a resource model with the same name provided.
   */
  async updateUnique(params: {
    id: string;
    name?: string;
    projectId: string;
    structure: Structure;
  }) {
    if (params.name) {
      const matchingResourceModels = await this.findByName({
        name: params.name,
        projectId: params.projectId,
      });

      if (
        matchingResourceModels.length > 0 &&
        matchingResourceModels[0].id !== params.id
      ) {
        throw ErrorResponse.badRequest('Resource model already exists.');
      }
    }

    const updated = await this.update(params);

    return updated;
  }
}
