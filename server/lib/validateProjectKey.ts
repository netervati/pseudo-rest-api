import { H3Event } from 'h3';
import ProjectKeyServices from '../services/projectKeyServices';
import ErrorResponse from '../utils/errorResponse';

export default async function (event: H3Event, projectApiKey: string) {
  const projectKeys = await new ProjectKeyServices(event).findByApiKey(
    projectApiKey
  );

  if (projectKeys.length === 0) {
    throw ErrorResponse.notFound('Project key does not exist');
  }

  return projectKeys;
}
