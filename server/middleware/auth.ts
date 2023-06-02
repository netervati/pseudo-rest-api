import { serverSupabaseUser } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);

  if (user === null) {
    throw createError({
      statusCode: HTTP_STATUS_UNAUTHORIZED,
      statusMessage: 'User is not authenticated.',
    });
  }

  event.context.auth = { user };
});
