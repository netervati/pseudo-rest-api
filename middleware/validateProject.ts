import useProjectStore from '~~/stores/useProjectStore';

/**
 * Custom client-side middleware. This should
 * be used in `onMounted`.
 */
export default async function () {
  const project = useProjectStore();
  const projectApikey = useProjectApiKey();

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

  navigateTo('/');
}
