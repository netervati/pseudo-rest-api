import { defineStore } from 'pinia';
import useModel from './useModel';
import { NormalizedModelData } from '~/types/models';

// TODO: Make this type reusable
// across FE & BE
type FakeSchema = {
  max?: number;
  min?: number;
  name: string;
  option: string;
  type: string;
};

type CreateProps = {
  increase: number;
  schema: FakeSchema[];
};

type Options = {
  onSuccess?: (key: string) => void;
};

export default defineStore('model-data', () => {
  const toast = useToast();
  const apiKey = useAppRefKey();

  const model = useModel();
  const modelId = computed(() => model.target!.id);

  const { data, pending, refresh } = useLazyFetch<NormalizedModelData[]>(
    () => `/models/${modelId.value}/model-data`,
    {
      method: 'GET',
      query: { apiKey },
      server: false,
    }
  );

  const list = computed(() => data.value || []);
  const isDisabled = computed(() => list.value.length === 50 || pending.value);

  const create = async (body: CreateProps, options: Options): Promise<void> => {
    await $fetch(`/models/${modelId.value}/model-data`, {
      method: 'POST',
      body: {
        apiKey,
        increase: body.increase,
        schema: body.schema,
      },
      async onResponse({ response }) {
        if (response.status === 200) {
          toast.success('Created a model!');

          if (typeof options.onSuccess === 'function') {
            options.onSuccess(response._data.secretKey);
          }

          await refresh();
        }
      },
    });
  };

  return {
    /** PROPERTIES */
    isDisabled,
    isLoading: pending,
    data,
    list,

    /** METHODS */
    create,
  };
});
