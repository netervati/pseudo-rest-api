import { H3Event } from 'h3';
import ProjectServices from '~~/server/services/projectServices';
import { PostProjectValidation } from '~~/server/validations';
import extractProjectKey from '~~/server/lib/extractProjectKey';

type BodyParams = {
  name: string;
  projectApiKey: string;
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
  const { projectId } = await extractProjectKey(event, body.projectApiKey);

  const updated = new ProjectServices(event).updateUnique({
    id: projectId,
    name: body.name,
  });

  return updated;
});
