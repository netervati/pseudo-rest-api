import ErrorResponse from '../utils/errorResponse';
import SupabaseService from './supabaseService';

export default class ProjectServices extends SupabaseService {
  get table() {
    return 'projects';
  }

  async create(params: {
    id: string;
    name: string;
    description: string | undefined;
  }) {
    const projects = await this.client
      .from(this.table)
      .insert({ ...params, user_id: this.user.id })
      .select('*');

    if (projects.error !== null) {
      throw ErrorResponse.supabase(projects.error);
    }

    return projects.data[0];
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
      .select('name, description, project_keys(api_key)')
      .eq('is_deleted', false)
      .eq('project_keys.is_deleted', false)
      .eq('user_id', this.user.id);

    if (projects.error !== null) {
      throw ErrorResponse.supabase(projects.error);
    }

    return projects.data;
  }
}
