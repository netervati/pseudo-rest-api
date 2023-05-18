import { H3Event } from 'h3';
import { ProjectKeyServices, ProjectServices } from '~~/server/services';
import { PostProjectValidation } from '~~/server/validations';
import ErrorResponse from '~~/server/utils/errorResponse';

type BodyParams = {
  name: string;
  projectApiKey: string;
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

  const projectKey = await new ProjectKeyServices(event).findByApiKey(
    body.projectApiKey
  );

  if (event.context.params.id !== projectKey[0]?.project_id) {
    throw ErrorResponse.badRequest("Project doesn't match API key");
  }

  const projects = new ProjectServices(event);
  const existingProjects = await projects.findByName(body.name);

  if (
    existingProjects.length > 0 &&
    existingProjects[0].id !== event.context.params.id
  ) {
    throw ErrorResponse.badRequest('Project already exists.');
  }

  return await projects.update({
    id: projectKey[0].project_id,
    name: body.name,
  });
});
