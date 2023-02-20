import { H3Event } from 'h3';
import { Database } from '~~/types/supabase';
import { serverSupabaseClient } from '#supabase/server';

export default class BaseRepository implements PseudoBaseRepository {
  client;
  userId;

  constructor(event: H3Event) {
    this.client = serverSupabaseClient<Database>(event);
    this.userId = event.context.auth.user.id;
  }
}
