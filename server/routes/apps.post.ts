import shortuuid from 'short-uuid';
import { AppKeyServices, AppServices } from '../services';

type BodyParams = {
  title: string;
  description?: string;
};

export default defineEventHandler(async (event) => {
  // TODO: Re-integrate validations with Zod
  const body: BodyParams = await readBody<BodyParams>(event);

  const created = await new AppServices(event).createUnique({
    title: body.title,
    description: body.description,
  });

  const secretKey = generateSecretKey();

  await new AppKeyServices(event).create({
    appKey: shortuuid.generate(),
    appId: created.id,
    secretKey: await hashPassword(secretKey),
  });

  return { secretKey };
});
