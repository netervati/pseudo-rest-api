import { Ref } from 'vue';

type SignInProgressProps = {
  isLoading: Ref<boolean>;
  Oauth: () => void;
};

/** A composable to manage the user sign in */
export default function (): SignInProgressProps {
  const route = useRoute();
  const toast = useToast();
  const user = useSupabaseUser();

  const isLoading = ref(false);
  const { auth } = useSupabaseAuthClient();

  const config = useRuntimeConfig();

  const getURL = () => {
    let url =
      config.public.siteUrl !== ''
        ? config.public.siteUrl
        : config.public.testUrl;

    url = url.includes('http') ? url : `https://${url}`;
    url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
    url = `${url}dashboard`;

    console.log(url);

    return url;
  };

  const Oauth = () => {
    auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: getURL(),
      },
    });

    isLoading.value = true;
  };

  const display = (msg: string) => {
    toast.dark(msg);
  };

  watchEffect(() => {
    if (route.hash.includes('#access_token')) {
      isLoading.value = true;

      display('Signing in user...');

      setTimeout(() => {
        display("It's taking us longer to sign you in...");
      }, 10000);
    }

    if (user.value) {
      navigateTo('/dashboard');
    }
  });

  return {
    isLoading,
    Oauth,
  };
}
