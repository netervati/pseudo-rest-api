import { Database } from './supabase';
import {
  PostgrestSingleResponse,
  PostgrestQueryBuilder,
} from '@supabase/postgrest-js';
import { SupabaseClient } from '@supabase/supabase-js';

declare global {
  interface APIError extends Error {
    statusCode: number;
    statusMessage: string;
  }

  type Result<T, E> = Ok<T, E> | Err<T, E>;
  type ValidationResult = Result<void, APIError>;

  type APIBody<T> = {
    attributes: T;
  };

  type APIBodyArray<T> = {
    data: APIBody<T>[];
  }

  type GetOptions = {
    [key: string]: string | number | boolean;
  };
  type RepositoryQueryResponse = Promise<PostgrestSingleResponse<any[]>>

  interface PseudoBaseRepository {
    client: SupabaseClient<Database>;
    userId: string;
    get?: (options: GetOptions) => RepositoryQueryResponse;
    insert?: (data: T) => RepositoryQueryResponse;
  };
}

export {};
