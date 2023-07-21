import useProject from '~/stores/useProject';

export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) {
    return;
  }

  const project = useProject();
  const projectApikey = to.params.urlpath;
  const toast = useToast();

  if (project.target?.project_keys[0].api_key === projectApikey) {
    return;
  }

  await project.refresh();

  const target = project.list.filter(
    (proj) => proj.project_keys[0].api_key === projectApikey
  );

  if (target.length === 1) {
    project.target = target[0];

    return;
  }

  toast.error('Project does not exists!');

  return navigateTo('/');
});
