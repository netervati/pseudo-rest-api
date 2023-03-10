import { H3Event } from 'h3';
import shortuuid from 'short-uuid';
import { ProjectKeyServices, ProjectServices } from '../services';
import { PostProjectValidation } from '../validations';
import ErrorResponse from '../utils/errorResponse';
import { Project } from '~~/types/models';

type BodyParams = {
  name: string;
  description?: string;
};

export default defineEventHandler(async (event) => {
  const body: BodyParams = await readBody<BodyParams>(event);

  validate(body, event);

  const existingProjects = await new ProjectServices(event).findByName(
    body.name
  );

  if (existingProjects.length > 0) {
    throw ErrorResponse.badRequest('Project already exists.');
  }

  const project = await new ProjectServices(event).create({
    name: body.name,
    description: body.description,
  });

  return {
    secret_key: await insertProjectKey(event, project),
  };
});

function validate(body: BodyParams, event: H3Event): void | never {
  if (event.context.auth.error) {
    throw event.context.auth.error;
  }

  const error = new PostProjectValidation(body).validate();

  if (error) {
    throw error;
  }
}

async function insertProjectKey(
  event: H3Event,
  project: Project
): Promise<string | never> {
  const secretKey = generateSecretKey();

  await new ProjectKeyServices(event).create({
    apiKey: shortuuid.generate(),
    projectId: project.id,
    secretKey: await hashPassword(secretKey),
  });

  return secretKey;
}
