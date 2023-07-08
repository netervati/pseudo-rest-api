type CommonStore = {
  fetch: () => Promise<void>;
};

/** Composable meant to handle store fetches on component mount */
export default function (stores: Array<CommonStore>) {
  onMounted(async () => {
    await Promise.all(stores.map((store) => store.fetch()));
  });
}
