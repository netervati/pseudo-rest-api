import ModelServices from '../services/modelServices';
import extractAppKey from '~~/server/lib/extractAppKey';

type BodyParams = {
  name: string;
  schema: { name: string; type: string }[];
  apiKey: string;
};

export default defineEventHandler(async (event) => {
  const body: BodyParams = await readBody<BodyParams>(event);
  const { appId } = await extractAppKey(event, body.apiKey);

  const created = await new ModelServices(event).create({
    appId,
    name: body.name,
    schema: body.schema,
  });

  return created;
});
