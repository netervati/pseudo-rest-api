import { H3Event } from 'h3';
import ProjectRepository from '../repositories/projectRepository';
import { Database } from '~~/types/supabase';

export default defineEventHandler(async (event) => {
  if (event.context.auth.error) {
    throw event.context.auth.error;
  }

  const response = await handleRequest(event);

  return {
    data: response,
  };
});

type SuccessfulRequest = {
  attributes: Database['public']['Tables']['projects']['Row'];
}[];

async function handleRequest(
  event: H3Event
): RequestResponse<SuccessfulRequest> {
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

  return projects.data!.map((project) => ({ attributes: { ...project } }));
}
