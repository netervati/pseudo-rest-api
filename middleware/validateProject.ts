import useProjectStore from '~~/stores/useProjectStore';

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) {
    return;
  }

  const project = useProjectStore();
  const projectApikey =
    from.path === '/' ? to.params.urlpath : useProjectApiKey();

  if (project.target?.project_keys[0].api_key === projectApikey) {
    return;
  }

  await project.fetch({ mutateCache: true });

  const target = project.list.filter(
    (proj) => proj.project_keys[0].api_key === projectApikey
  );

  if (target.length === 1) {
    project.target = target[0];

    return;
  }

  return navigateTo('/');
});
