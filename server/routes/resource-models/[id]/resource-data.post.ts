import { H3Event } from 'h3';
import ErrorResponse from '../../../utils/errorResponse';
import {
  ResourceDataServices,
  ResourceModelServices,
} from '~~/server/services';
import { PostResourceDataValidation } from '~~/server/validations';
import generateResourceData from '~~/server/utils/generateResourceData';
import extractProjectKey from '~~/server/lib/extractProjectKey';

type BodyParams = {
  count: number;
  projectApiKey: string;
};

async function validate(event: H3Event): Promise<BodyParams | never> {
  const body = await readBody<BodyParams>(event);
  const error = new PostResourceDataValidation(body).validate();

  if (error) {
    throw error;
  }

  return body;
}

export default defineEventHandler(async (event) => {
  const body = await validate(event);

  await extractProjectKey(event, body.projectApiKey);

  const resourceModel = await new ResourceModelServices(event).find(
    event.context.params.id
  );

  if (resourceModel === null) {
    throw ErrorResponse.badRequest('Resource model does not exist.');
  }

  const data = [];

  while (data.length < body.count) {
    data.push(generateResourceData(resourceModel.structure));
  }

  const list = await new ResourceDataServices(event).bulkCreate({
    data,
    resourceModelId: resourceModel.id,
  });

  return list;
});
