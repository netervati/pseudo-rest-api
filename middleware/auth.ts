export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser();
  const toast = useToast();

  if (!user.value) {
    return navigateTo('/login');
  }

  if (from.path === '/login' && to.path === '/dashboard') {
    toast.dark('Successfully signed in');
  }
});
