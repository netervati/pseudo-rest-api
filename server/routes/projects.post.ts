import { H3Event } from 'h3';
import { v4 as uuidv4 } from 'uuid';
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

  validate({ body, event });

  const existingProjects = await new ProjectServices(event).findByName(body);

  if (existingProjects.length > 0) {
    throw ErrorResponse.badRequest('Project already exists.');
  }

  const project = await new ProjectServices(event).create({
    id: uuidv4(),
    name: body.name,
    description: body.description,
  });

  return {
    secret_key: await insertProjectKey({
      event,
      project,
    }),
  };
});

type ValidationParams = {
  body: BodyParams;
  event: H3Event;
};

function validate({ body, event }: ValidationParams): void | never {
  if (event.context.auth.error) {
    throw event.context.auth.error;
  }

  const error = new PostProjectValidation(body).validate();

  if (error) {
    throw error;
  }
}

type InsertParams = {
  event: H3Event;
  project: Project;
};

async function insertProjectKey({
  event,
  project,
}: InsertParams): Promise<string | never> {
  const secretKey = generateSecretKey();

  await new ProjectKeyServices(event).create({
    id: uuidv4(),
    api_key: shortuuid.generate(),
    project_id: project.id,
    secret_key: await hashPassword(secretKey),
  });

  return secretKey;
}
