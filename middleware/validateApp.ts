import useApp from '~/stores/useApp';

export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) {
    return;
  }

  const app = useApp();
  const appKey = to.params.urlpath;
  const toast = useToast();

  if (app.target?.app_keys[0].app_key === appKey) {
    return;
  }

  await app.refresh();

  const target = app.list.filter((proj) => proj.app_keys[0].app_key === appKey);

  if (target.length === 1) {
    app.target = target[0];

    return;
  }

  toast.error('App does not exists!');

  return navigateTo('/dashboard');
});
