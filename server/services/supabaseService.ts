import { H3Event } from 'h3';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { serverSupabaseServiceRole } from '#supabase/server';
import { Database } from '~~/types/supabase';

export default class SupabaseService {
  client: SupabaseClient<Database>;
  user: User;

  constructor(event: H3Event) {
    this.client = serverSupabaseServiceRole<Database>(event);
    this.user = event.context._user;
  }
}
