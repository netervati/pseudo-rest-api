import BaseRepository from './baseRepository';
import { Database } from '~~/types/supabase';

type ProjectKeysTable = Database['public']['Tables']['project_keys'];

export default class ProjectKeyRepository extends BaseRepository {
  async insert(data: ProjectKeysTable['Insert']) {
    return await this.client.from('project_keys').insert(data).select();
  }
}
