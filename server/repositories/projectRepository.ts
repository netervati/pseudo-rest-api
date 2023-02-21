import BaseRepository from './baseRepository';
import { Database } from '~~/types/supabase';

type ProjectsTable = Database['public']['Tables']['projects'];

export default class ProjectRepository extends BaseRepository {
  get table() {
    return 'projects';
  }

  async insert(data: ProjectsTable['Insert']): RepositoryQueryResponse {
    return await this.create(data);
  }

  async getWithProjectKey(options = {}): RepositoryQueryResponse {
    const query = this.client
      .from(this.table)
      .select('*, project_keys(*)')
      .eq('project_keys.is_deleted', false);

    for (const [key, value] of Object.entries(options)) {
      query.eq(key, value);
    }

    return await query.eq('user_id', this.userId);
  }
}
