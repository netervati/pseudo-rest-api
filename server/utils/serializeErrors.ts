export default function (errors: SerializedError[]): SerializedError {
  const data: SerializedError['data'] = [];

  errors.forEach(({ statusMessage }) => {
    data.push({ statusMessage });
  });

  return {
    data,
    statusCode: 400,
    statusMessage: 'Invalid parameter/s',
  };
}
