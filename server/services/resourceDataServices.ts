import { v4 as uuidv4 } from 'uuid';
import ErrorResponse from '../utils/errorResponse';
import SupabaseService from './supabaseService';

type Data = { [key: string]: string | number | boolean }[];

export default class ResourceDataServices extends SupabaseService {
  get table() {
    return 'resource_data';
  }

  async create(params: { data: Data; resourceModelId: string }) {
    const resourceData = await this.client
      .from(this.table)
      .insert({
        id: uuidv4(),
        data: params.data,
        resource_model_id: params.resourceModelId,
        user_id: this.user.id,
      })
      .select('*');

    if (resourceData.error !== null) {
      throw ErrorResponse.supabase(resourceData.error);
    }

    return resourceData.data;
  }
}
