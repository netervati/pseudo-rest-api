export default defineNuxtRouteMiddleware((to, _from) => {
  let updated;

  if (['/', '/dashboard', '/docs', '/login'].includes(to.path)) {
    return;
  }

  if (typeof to.params.urlpath === 'string') {
    updated = to.params.urlpath;
  } else {
    updated = '';
  }

  useAppRefKey().value = updated;
});
