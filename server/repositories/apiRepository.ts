import BaseRepository from './baseRepository';
import { Database } from '~~/types/supabase';

type ApisTable = Database['public']['Tables']['apis'];

export default class ApiRepository extends BaseRepository<ApisTable> {
  get table() {
    return 'apis';
  }
}
