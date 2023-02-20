import BaseRepository from './baseRepository';
import { Database } from '~~/types/supabase';

type ProjectsTable = Database['public']['Tables']['projects'];

export default class ProjectRepository extends BaseRepository {
  async get(options = {}) {
    const query = this.client.from('projects').select();

    for (const [key, value] of Object.entries(options)) {
      query.eq(key, value);
    }

    return await query.eq('user_id', this.userId);
  }

  async insert(data: ProjectsTable['Insert']) {
    return await this.client.from('projects').insert(data).select();
  }
}
