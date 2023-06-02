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
  const userProjects = await project.list();

  if (userProjects.length === MAX_PROJECTS_ALLOWED) {
    throw ErrorResponse.badRequest(
      'You have exceeded the allowed number of Projects.'
    );
  }

  const matchingProjectNames = userProjects.filter(
    (proj) => proj.name === body.name
  );

  if (matchingProjectNames.length) {
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
