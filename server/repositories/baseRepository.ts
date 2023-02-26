import { H3Event } from 'h3';
import { Database, Json } from '~~/types/supabase';
import { serverSupabaseClient } from '#supabase/server';

export default class BaseRepository<T extends Record<string, Json>> {
  client;
  userId;

  constructor(event: H3Event) {
    this.client = serverSupabaseClient<Database>(event);
    this.userId = event.context.auth.user.id;
  }

  get table(): string {
    return '';
  }

  async get(conditions = {}, select = '*'): RepositoryQueryResponse {
    const query = this.client.from(this.table).select(select);

    for (const [key, value] of Object.entries(conditions)) {
      query.eq(key, value);
    }

    return await query.eq('user_id', this.userId);
  }

  async insert(data: T['Insert']): RepositoryQueryResponse {
    return await this.client.from(this.table).insert(data).select();
  }
}
