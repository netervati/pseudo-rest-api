import { H3Event } from 'h3';
import ProjectRepository from '../repositories/projectRepository';
import { Project } from '~~/types/models';

export default defineEventHandler(async (event) => {
  if (event.context.auth.error) {
    throw event.context.auth.error;
  }

  const projects = await getProjects(event);

  return {
    data: projects.map((project) => ({ attributes: { ...project } })),
  };
});

async function getProjects(event: H3Event): Promise<Project[] | never> {
  const projects = await new ProjectRepository(event).get(
    {
      'project_keys.is_deleted': false,
      is_deleted: false,
    },
    'name, description, project_keys(api_key)'
  );

  if (projects.error instanceof Error) {
    throw projects.error;
  }

  return projects.data!;
}
