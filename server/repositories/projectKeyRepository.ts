import BaseRepository from './baseRepository';
import { Database } from '~~/types/supabase';

type ProjectKeysTable = Database['public']['Tables']['project_keys'];

export default class ProjectKeyRepository extends BaseRepository<ProjectKeysTable> {
  get table() {
    return 'project_keys';
  }

  async getWithProject(options = {}): RepositoryQueryResponse {
    const query = this.client.from(this.table).select('*, projects(*)');

    for (const [key, value] of Object.entries(options)) {
      query.eq(key, value);
    }

    return await query.eq('user_id', this.userId);
  }
}
