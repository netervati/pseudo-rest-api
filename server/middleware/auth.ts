import { serverSupabaseUser } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  let error = null;

  if (user === null) {
    error = createError({
      statusCode: HTTP_STATUS_UNAUTHORIZED,
      statusMessage: 'User is not authenticated.',
    });
  }

  event.context.auth = { error, user };
});
