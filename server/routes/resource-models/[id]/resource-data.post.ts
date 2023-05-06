import { H3Event } from 'h3';
import ErrorResponse from '../../../utils/errorResponse';
import {
  ResourceDataServices,
  ResourceModelServices,
} from '~~/server/services';
import { PostResourceDataValidation } from '~~/server/validations';
import generateResourceData from '~~/server/utils/generateResourceData';
import validateProjectKey from '~~/server/lib/validateProjectKey';

type BodyParams = {
  count: number;
  projectApiKey: string;
};

async function validate(event: H3Event): Promise<BodyParams | never> {
  if (event.context.auth.error) {
    throw event.context.auth.error;
  }

  const body = await readBody<BodyParams>(event);
  const error = new PostResourceDataValidation(body).validate();

  if (error) {
    throw error;
  }

  return body;
}

export default defineEventHandler(async (event) => {
  const body = await validate(event);

  await validateProjectKey(event, body.projectApiKey);

  const resourceModel = await new ResourceModelServices(event).find(
    event.context.params.id
  );

  if (resourceModel === null) {
    throw ErrorResponse.badRequest('Resource model does not exist.');
  }

  const resourceData = [];

  while (resourceData.length < body.count) {
    resourceData.push(
      await new ResourceDataServices(event).create({
        data: generateResourceData(resourceModel.structure),
        resourceModelId: resourceModel.id,
      })
    );
  }

  return resourceData;
});
