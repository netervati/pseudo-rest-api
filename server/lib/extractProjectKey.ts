import { H3Event } from 'h3';
import ProjectKeyServices from '../services/projectKeyServices';
import ErrorResponse from '../utils/errorResponse';

/**
 * Finds the project api key record based on the
 * `projectApiKey` param.
 *
 * @param event
 * @param projectApiKey
 * @returns The project key and project ID
 */
export default async function (event: H3Event, projectApiKey: string) {
  const projectKeys = await new ProjectKeyServices(event).findByApiKey(
    projectApiKey
  );

  if (projectKeys.length === 0) {
    throw ErrorResponse.notFound('Project key does not exist');
  }

  return {
    projectId: projectKeys[0].project_id,
    projectKey: projectKeys[0],
  };
}
