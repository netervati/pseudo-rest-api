import BaseRepository from './baseRepository';
import { Database } from '~~/types/supabase';

type ResourceModelTable = Database['public']['Tables']['resource_models'];

export default class ResourceModelRepository extends BaseRepository<ResourceModelTable> {
  get table() {
    return 'resource_models';
  }
}
