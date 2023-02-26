import BaseRepository from './baseRepository';
import { Database } from '~~/types/supabase';

type ResourceDataTable = Database['public']['Tables']['resource_data'];

export default class ResourceDataRepository extends BaseRepository<ResourceDataTable> {
  get table() {
    return 'resource_data';
  }
}
