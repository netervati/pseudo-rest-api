import { v4 as uuidv4 } from 'uuid';
import ErrorResponse from '../utils/errorResponse';
import SupabaseService from './supabaseService';

type Data = { [key: string]: string | number | boolean };

export default class ResourceDataServices extends SupabaseService {
  get table() {
    return 'resource_data';
  }

  async batchDelete(params: { ids: string[]; resourceModelId: string }) {
    return await Promise.all(
      params.ids.map((id) => {
        return this.client
          .from(this.table)
          .update({
            is_deleted: true,
            deleted_at: new Date().toISOString().toLocaleString(),
          })
          .eq('id', id)
          .eq('resource_data_id', params.resourceModelId)
          .eq('user_id', this.user.id)
          .select('*');
      })
    );
  }

  async bulkCreate(params: { data: Data[]; resourceModelId: string }) {
    return await Promise.all(
      params.data.map((data) => {
        return this.client
          .from(this.table)
          .insert({
            id: uuidv4(),
            data,
            resource_model_id: params.resourceModelId,
            user_id: this.user.id,
          })
          .select('*');
      })
    );
  }

  async bulkUpdate(params: { data: Data; id: string }[]) {
    return await Promise.all(
      params.map(({ data, id }) => {
        return this.client
          .from(this.table)
          .update({ data })
          .eq('id', id)
          .eq('user_id', this.user.id)
          .select('*');
      })
    );
  }

  async bulkDelete(resourceModelId: string) {
    const resourceData = await this.client
      .from(this.table)
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString().toLocaleString(),
      })
      .eq('is_deleted', false)
      .eq('resource_model_id', resourceModelId)
      .eq('user_id', this.user.id)
      .select('*');

    if (resourceData.error !== null) {
      throw ErrorResponse.supabase(resourceData.error);
    }

    return resourceData.data;
  }

  async delete(params: { id: string; resourceModelId: string }) {
    const resourceData = await this.client
      .from(this.table)
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString().toLocaleString(),
      })
      .eq('id', params.id)
      .eq('resource_model_id', params.resourceModelId)
      .eq('user_id', this.user.id)
      .select('*');

    if (resourceData.error !== null) {
      throw ErrorResponse.supabase(resourceData.error);
    }

    return resourceData.data[0];
  }

  async list(resourceModelId: string) {
    const resourceData = await this.client
      .from(this.table)
      .select('*')
      .eq('is_deleted', false)
      .eq('resource_model_id', resourceModelId)
      .eq('user_id', this.user.id)
      .order('created_at', { ascending: false });

    if (resourceData.error !== null) {
      throw ErrorResponse.supabase(resourceData.error);
    }

    return resourceData.data;
  }
}
