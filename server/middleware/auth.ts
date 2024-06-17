import { serverSupabaseUser } from '#supabase/server';

export default defineEventHandler(async (event) => {
  await serverSupabaseUser(event);
});
