import { PostgrestError } from '@supabase/postgrest-js';
import { NuxtError } from 'nuxt/dist/app/composables';

export default {
  badRequest(message: string): NuxtError {
    return createError({
      statusCode: HTTP_STATUS_BAD_REQUEST,
      statusMessage: message,
    });
  },
  notFound(message: string): NuxtError {
    return createError({
      statusCode: HTTP_STATUS_NOT_FOUND,
      statusMessage: message,
    });
  },
  supabase(error: PostgrestError): NuxtError {
    return createError({
      statusCode: HTTP_STATUS_BAD_REQUEST,
      statusMessage: error.message,
    });
  },
};
