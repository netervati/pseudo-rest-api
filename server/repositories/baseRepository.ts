import { H3Event } from 'h3';
import {
  PostgrestResponseFailure,
  PostgrestResponseSuccess,
} from '@supabase/postgrest-js';
import { NuxtError } from 'nuxt/dist/app/composables';
import { Database, Json } from '~~/types/supabase';
import { serverSupabaseClient } from '#supabase/server';

type QueryResponse<T extends Record<string, Json>> = {
  data: T['Row'][] | null;
  error: NuxtError | null;
};

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

  #format(
    query: PostgrestResponseSuccess<T['Row'][]> | PostgrestResponseFailure
  ): QueryResponse<T> {
    const error =
      query.error === null
        ? null
        : createError({
            statusCode: HTTP_STATUS_BAD_REQUEST,
            statusMessage: query.error.message,
          });

    return {
      data: query.data,
      error,
    };
  }

  async get(conditions = {}, select = '*'): Promise<QueryResponse<T>> {
    const query = this.client.from(this.table).select(select);

    for (const [key, value] of Object.entries(conditions)) {
      query.eq(key, value);
    }

    // TODO: Currently, query results to GenericStringError[] when value passed
    // on `.select()` is not a string literal. Remove the ignore comment once
    // supabase supports string.
    return this.#format(
      // @ts-ignore
      await query.eq('user_id', this.userId)
    );
  }

  async insert(data: T['Insert']): Promise<QueryResponse<T>> {
    return this.#format(
      await this.client.from(this.table).insert(data).select('*')
    );
  }
}
