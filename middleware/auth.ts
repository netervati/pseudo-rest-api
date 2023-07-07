export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const toast = useToast();

    if (from.path === '/login' && to.path === '/') {
      toast.dark('Successfully signed in');
    }

    return;
  }

  const user = useSupabaseUser();

  if (!user.value) {
    return navigateTo('/login');
  }
});
