import AppServices from '~~/server/services/appServices';
import extractAppKey from '~~/server/lib/extractAppKey';

type BodyParams = {
  description?: string;
  title: string;
  apiKey: string;
};

export default defineEventHandler(async (event) => {
  const body: BodyParams = await readBody<BodyParams>(event);
  const { appId } = await extractAppKey(event, body.apiKey);

  const updated = new AppServices(event).updateUnique({
    id: appId,
    description: body.description,
    title: body.title,
  });

  return updated;
});
