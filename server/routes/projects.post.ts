import { H3Event } from 'h3';
import shortuuid from 'short-uuid';
import { ProjectKeyServices, ProjectServices } from '../services';
import { PostProjectValidation } from '../validations/projectsValidations';

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

  const created = await new ProjectServices(event).createUnique({
    name: body.name,
    description: body.description,
  });

  const secretKey = generateSecretKey();

  await new ProjectKeyServices(event).create({
    apiKey: shortuuid.generate(),
    projectId: created.id,
    secretKey: await hashPassword(secretKey),
  });

  return { secretKey };
});
