import { H3Event } from 'h3';
import ProjectServices from '~~/server/services/projectServices';
import { PutProjectValidation } from '~~/server/validations/projectsValidations';
import extractProjectKey from '~~/server/lib/extractProjectKey';

type BodyParams = {
  description?: string;
  name: string;
  projectApiKey: string;
};

async function validate(event: H3Event): Promise<BodyParams | never> {
  const body: BodyParams = await readBody<BodyParams>(event);
  const error = new PutProjectValidation(body).validate();

  if (error) {
    throw error;
  }

  return body;
}

export default defineEventHandler(async (event) => {
  const body = await validate(event);
  const { projectId } = await extractProjectKey(event, body.projectApiKey);

  const updated = new ProjectServices(event).updateUnique({
    id: projectId,
    description: body.description,
    name: body.name,
  });

  return updated;
});
