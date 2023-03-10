import { H3Event } from 'h3';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { serverSupabaseClient } from '#supabase/server';
import { Database } from '~~/types/supabase';

export default class SupabaseService {
  client: SupabaseClient<Database>;
  user: User;

  constructor(event: H3Event) {
    this.client = serverSupabaseClient<Database>(event);
    this.user = event.context.auth.user;
  }
}
