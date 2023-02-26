import BaseRepository from './baseRepository';
import { Database } from '~~/types/supabase';

type ProjectsTable = Database['public']['Tables']['projects'];

export default class ProjectRepository extends BaseRepository<ProjectsTable> {
  get table() {
    return 'projects';
  }

  async getWithProjectKey(options = {}, select = '*'): RepositoryQueryResponse {
    const query = this.client
      .from(this.table)
      .select(`${select}, project_keys(api_key)`)
      .eq('project_keys.is_deleted', false);

    for (const [key, value] of Object.entries(options)) {
      query.eq(key, value);
    }

    return await query.eq('user_id', this.userId);
  }
}
