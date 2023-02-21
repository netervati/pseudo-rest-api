import { H3Event } from 'h3';
import { Database } from '~~/types/supabase';
import { serverSupabaseClient } from '#supabase/server';

export default class BaseRepository {
  client;
  userId;

  constructor(event: H3Event) {
    this.client = serverSupabaseClient<Database>(event);
    this.userId = event.context.auth.user.id;
  }

  get table(): string {
    return '';
  }

  async get(options = {}): RepositoryQueryResponse {
    const query = this.client.from(this.table).select();

    for (const [key, value] of Object.entries(options)) {
      query.eq(key, value);
    }

    return await query.eq('user_id', this.userId);
  }

  async create(data = {}): RepositoryQueryResponse {
    return await this.client.from(this.table).insert(data).select();
  }
}
