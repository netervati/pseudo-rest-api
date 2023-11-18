import { H3Event } from 'h3';
import AppKeyServices from '../services/appKeyServices';
import ErrorResponse from '../utils/errorResponse';

/**
 * Finds the project api key record based on the
 * `appKey` param.
 *
 * @param event
 * @param appKey
 * @returns The app key and app ID
 */
export default async function (event: H3Event, appKey: string) {
  const appKeys = await new AppKeyServices(event).findAppKey(appKey);

  if (appKeys.length === 0) {
    throw ErrorResponse.notFound('Project key does not exist');
  }

  return {
    appId: appKeys[0].app_id,
    appKey: appKeys[0],
  };
}
