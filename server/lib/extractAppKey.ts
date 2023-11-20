import { H3Event } from 'h3';
import AppKeyServices from '../services/appKeyServices';
import ErrorResponse from '../utils/errorResponse';

/**
 * Finds the app key based on the `apiKey` param.
 *
 * @param event
 * @param apiKey
 * @returns The app key and app ID
 */
export default async function (event: H3Event, apiKey: string) {
  const appKeys = await new AppKeyServices(event).findByApiKey(apiKey);

  if (appKeys.length === 0) {
    throw ErrorResponse.notFound('App key does not exist');
  }

  return {
    appId: appKeys[0].app_id,
    appKey: appKeys[0],
  };
}
