import { H3Event } from 'h3';
import { v4 as uuidv4 } from 'uuid';
import shortuuid from 'short-uuid';
import { PostProjectValidation } from '../validations';
import { ProjectKeyRepository, ProjectRepository } from '../repositories';
import { Project } from '~~/types/models';

type BodyParams = {
  name: string;
  description?: string;
};

type Payload = {
  body: BodyParams;
  event: H3Event;
  project?: Project;
};

export default defineEventHandler(async (event) => {
  const payload: Payload = {
    body: await readBody<BodyParams>(event),
    event,
  };

  validate(payload);

  payload.project = await insertProject(payload);

  return {
    secret_key: await insertProjectKey(payload),
  };
});

function validate({ body, event }: Payload): void | never {
  if (event.context.auth.error) {
    throw event.context.auth.error;
  }

  const error = new PostProjectValidation(body).validate();

  if (error) {
    throw error;
  }
}

async function insertProject({
  body,
  event,
}: Payload): Promise<Project | never> {
  const projects = await new ProjectRepository(event).insert({
    id: uuidv4(),
    name: body.name,
    description: body.description,
    user_id: event.context.auth.user.id,
  });

  if (projects.error instanceof Error) {
    throw projects.error;
  }

  return projects.data![0];
}

async function insertProjectKey({
  event,
  project,
}: Payload): Promise<string | never> {
  const secretKey = generateSecretKey();

  const projectKeys = await new ProjectKeyRepository(event).insert({
    id: uuidv4(),
    api_key: shortuuid.generate(),
    secret_key: await hashPassword(secretKey),
    project_id: project!.id,
    user_id: event.context.auth.user.id,
  });

  if (projectKeys.error instanceof Error) {
    throw projectKeys.error;
  }

  return secretKey;
}
