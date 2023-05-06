import { H3Event } from 'h3';
import shortuuid from 'short-uuid';
import { ProjectKeyServices, ProjectServices } from '../services';
import { PostProjectValidation } from '../validations';
import ErrorResponse from '../utils/errorResponse';

type BodyParams = {
  name: string;
  description?: string;
};

async function validate(event: H3Event): Promise<BodyParams | never> {
  if (event.context.auth.error) {
    throw event.context.auth.error;
  }

  const body: BodyParams = await readBody<BodyParams>(event);
  const error = new PostProjectValidation(body).validate();

  if (error) {
    throw error;
  }

  return body;
}

export default defineEventHandler(async (event) => {
  const body = await validate(event);

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

  const secretKey = generateSecretKey();

  await new ProjectKeyServices(event).create({
    apiKey: shortuuid.generate(),
    projectId: project.id,
    secretKey: await hashPassword(secretKey),
  });

  return { secretKey };
});
