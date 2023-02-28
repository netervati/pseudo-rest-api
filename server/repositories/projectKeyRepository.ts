import BaseRepository from './baseRepository';
import { Database } from '~~/types/supabase';

type ProjectKeysTable = Database['public']['Tables']['project_keys'];

export default class ProjectKeyRepository extends BaseRepository<ProjectKeysTable> {
  get table() {
    return 'project_keys';
  }
}
