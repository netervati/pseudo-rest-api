import { Database } from './supabase';
import { PostgrestSingleResponse } from '@supabase/postgrest-js';
import { SupabaseClient } from '@supabase/supabase-js';
import { NuxtError } from 'nuxt/dist/app/composables';

declare global {
  interface SerializedError {
    data?: { [key: string]: string }[];
    statusCode: number;
    statusMessage: string;
  };

  type ValidationResult = undefined | NuxtError;

  type APIBody<T> = {
    attributes: T;
  };

  type APIBodyArray<T> = {
    data: APIBody<T>[];
  };

  type RequestResponse<T> = Promise<T | NuxtError>;
}

export {};
