import { NuxtError } from 'nuxt/dist/app/composables';

export default function (errors: SerializedError[]): NuxtError {
  const data: { statusMessage: string }[] = [];

  errors.forEach(({ statusMessage }) => {
    data.push({ statusMessage });
  });

  return createError({
    data,
    statusCode: HTTP_STATUS_BAD_REQUEST,
    statusMessage: 'Invalid parameter/s',
  });
}
