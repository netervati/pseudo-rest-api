import { v4 as uuidv4 } from 'uuid';
import ErrorResponse from '../utils/errorResponse';
import SupabaseService from './supabaseService';

export default class ProjectServices extends SupabaseService {
  get table() {
    return 'projects';
  }

  async create(params: { name: string; description: string | undefined }) {
    const projects = await this.client
      .from(this.table)
      .insert({
        ...params,
        id: uuidv4(),
        user_id: this.user.id,
      })
      .select('*');

    if (projects.error !== null) {
      throw ErrorResponse.supabase(projects.error);
    }

    return projects.data[0];
  }

  async delete(id: string) {
    const projects = await this.client
      .from(this.table)
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString().toLocaleString(),
      })
      .eq('id', id)
      .select('*');

    if (projects.error !== null) {
      throw ErrorResponse.supabase(projects.error);
    }

    return projects.data[0];
  }

  async find(id: string) {
    const project = await this.client
      .from(this.table)
      .select('*')
      .eq('is_deleted', false)
      .eq('id', id)
      .eq('user_id', this.user.id);

    if (project.error !== null) {
      throw ErrorResponse.supabase(project.error);
    }

    if (project.data.length === 0) {
      throw ErrorResponse.notFound('Project does not exist.');
    }

    return project.data[0];
  }

  async findByName(name: string) {
    const project = await this.client
      .from(this.table)
      .select('*')
      .eq('is_deleted', false)
      .eq('name', name)
      .eq('user_id', this.user.id);

    if (project.error !== null) {
      throw ErrorResponse.supabase(project.error);
    }

    return project.data;
  }

  async list() {
    const projects = await this.client
      .from(this.table)
      .select('id, name, description, project_keys(api_key)')
      .eq('is_deleted', false)
      .eq('project_keys.is_deleted', false)
      .eq('user_id', this.user.id);

    if (projects.error !== null) {
      throw ErrorResponse.supabase(projects.error);
    }

    return projects.data;
  }

  async update(params: { id: string; name: string }) {
    const projects = await this.client
      .from(this.table)
      .update({ name: params.name })
      .eq('id', params.id)
      .eq('user_id', this.user.id)
      .select('*');

    if (projects.error !== null) {
      throw ErrorResponse.supabase(projects.error);
    }

    return projects.data[0];
  }

  /**
   * Creates a new project only if the project's name is unique
   * amongst the user's owned projects.
   *
   * @param params - the payload for the `create` query method.
   * @returns the new project.
   * @throws Will throw if user is about to exceed the allowed number of projects.
   * @throws Will throw if user already has a project with the same name provided.
   */
  async createUnique(params: {
    name: string;
    description: string | undefined;
  }) {
    const list = await this.list();

    if (list.length === MAX_PROJECTS_ALLOWED) {
      throw ErrorResponse.badRequest(
        'You have exceeded the allowed number of Projects.'
      );
    }

    const matchingNames = list.filter((proj) => proj.name === params.name);

    if (matchingNames.length) {
      throw ErrorResponse.badRequest('Project already exists.');
    }

    const created = await this.create({
      name: params.name,
      description: params.description,
    });

    return created;
  }

  /**
   * Updates the project only if the project's name is unique
   * amongst the user's owned projects.
   *
   * @param params - the payload for the `update` query method
   * @returns the updated project.
   * @throws Will throw if user already has a project with the same name provided.
   */
  async updateUnique(params: { id: string; name: string }) {
    const list = await this.findByName(params.name);

    if (list.length > 0 && list[0].id !== params.id) {
      throw ErrorResponse.badRequest('Project already exists.');
    }

    const updated = await this.update({
      id: params.id,
      name: params.name,
    });

    return updated;
  }
}
