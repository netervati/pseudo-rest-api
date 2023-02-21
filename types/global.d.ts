import { Database } from './supabase';
import { PostgrestSingleResponse } from '@supabase/postgrest-js';
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

  type RepositoryQueryResponse = Promise<PostgrestSingleResponse<any[]>>
}

export {};
