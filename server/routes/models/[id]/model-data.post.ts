import ErrorResponse from '../../../utils/errorResponse';
import {
  ModelServices,
  ModelDataServices,
} from '~~/server/services';
import generateResourceData from '~~/server/utils/generateResourceData';
import extractAppKey from '~~/server/lib/extractAppKey';

type FakeSchema = {
  name: string;
  option: string;
};

type BodyParams = {
  apiKey: string;
  increase: number;
  mockData: FakeSchema[]
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

  // const data = [];

  // while (data.length < body.count) {
  //   data.push(generateResourceData(resourceModel.structure));
  // }

  // const created = await new ResourceDataServices(event).bulkCreate({
  //   data,
  //   resourceModelId: resourceModel.id,
  // });

  // return created;
});
