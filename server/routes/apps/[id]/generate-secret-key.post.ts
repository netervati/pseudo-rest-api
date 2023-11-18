import shortuuid from 'short-uuid';
import { AppKeyServices, AppServices } from '~~/server/services';
import extractAppKey from '~~/server/lib/extractAppKey';

type BodyParams = {
  appKey: string;
};

export default defineEventHandler(async (event) => {
  const body: BodyParams = await readBody<BodyParams>(event);
  const appId = event.context.params?.id ?? '';

  await new AppServices(event).find(appId);

  const { appKey } = await extractAppKey(event, body.appKey);
  const appKeys = new AppKeyServices(event);

  await appKeys.delete(appKey.id);

  const secretKey = generateSecretKey();
  const apiKey = shortuuid.generate();

  await appKeys.create({
    apiKey,
    appId,
    secretKey: await hashPassword(secretKey),
  });

  return {
    apiKey,
    secretKey,
  };
});
