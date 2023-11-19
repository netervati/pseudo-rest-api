import ErrorResponse from '../../../utils/errorResponse';
import { ModelServices, ModelDataServices } from '~~/server/services';
import extractAppKey from '~~/server/lib/extractAppKey';

type FakeSchema = {
  max?: number;
  min?: number;
  name: string;
  option: string;
  type: string;
};

type BodyParams = {
  apiKey: string;
  increase: number;
  schema: FakeSchema[];
};

export default defineEventHandler(async (event) => {
  const body = await readBody<BodyParams>(event);

  await extractAppKey(event, body.apiKey);

  const model = await new ModelServices(event).find(
    event.context.params?.id ?? ''
  );

  const currentTotal = await new ModelDataServices(event).count(model.id);

  if (currentTotal + body.increase > MAX_RESOURCE_DATA_ALLOWED) {
    throw ErrorResponse.badRequest(
      'You have exceeded the allowed number of Model Data for this Model.'
    );
  }

  const created = await new ModelDataServices(event).bulkCreate({
    data: generateModelData(body.schema, body.increase),
    modelId: model.id,
  });

  return created;
});
