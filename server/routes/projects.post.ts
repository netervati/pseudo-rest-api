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
  const project = new ProjectServices(event);
  const existingProjects = await project.list();

  if (existingProjects.length === 2) {
    throw ErrorResponse.badRequest(
      'You have exceeded the allowed number of Projects.'
    );
  }

  if (existingProjects.filter((proj) => proj.name === body.name).length) {
    throw ErrorResponse.badRequest('Project already exists.');
  }

  const newProject = await project.create({
    name: body.name,
    description: body.description,
  });

  const secretKey = generateSecretKey();

  await new ProjectKeyServices(event).create({
    apiKey: shortuuid.generate(),
    projectId: newProject.id,
    secretKey: await hashPassword(secretKey),
  });

  return { secretKey };
});
