import BaseRepository from './baseRepository';
import { Database } from '~~/types/supabase';

type ProjectsTable = Database['public']['Tables']['projects'];

export default class ProjectRepository extends BaseRepository<ProjectsTable> {
  get table() {
    return 'projects';
  }
}
