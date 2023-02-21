import BaseRepository from './baseRepository';
import { Database } from '~~/types/supabase';

type ApisTable = Database['public']['Tables']['apis'];

export default class ApiRepository extends BaseRepository {
  get table() {
    return 'apis';
  }

  async insert(data: ApisTable['Insert']): RepositoryQueryResponse {
    return await this.create(data);
  }
}
