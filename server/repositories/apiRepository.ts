import BaseRepository from './baseRepository';
import { Database } from '~~/types/supabase';

type ApisTable = Database['public']['Tables']['apis'];

export default class ApiRepository extends BaseRepository {
  async insert(data: ApisTable['Insert']) {
    return await this.client.from('apis').insert(data).select();
  }
}
