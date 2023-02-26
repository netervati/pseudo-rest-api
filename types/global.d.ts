import { Database } from './supabase';
import { PostgrestSingleResponse } from '@supabase/postgrest-js';
import { SupabaseClient } from '@supabase/supabase-js';

declare global {
  interface SerializedError {
    data?: { [key: string]: string }[];
    statusCode: number;
    statusMessage: string;
  };

  interface APIError extends Error, SerializedError {
    serialize: () => SerializedError;
  };

  type Result<T, E> = Ok<T, E> | Err<T, E>;
  type ValidationResult = undefined | SerializedError;

  type APIBody<T> = {
    attributes: T;
  };

  type APIBodyArray<T> = {
    data: APIBody<T>[];
  }

  type RepositoryQueryResponse = Promise<PostgrestSingleResponse<any[]>>
}

export {};
