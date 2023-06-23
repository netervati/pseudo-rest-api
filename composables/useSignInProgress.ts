import { Ref } from 'vue';

type SignInProgressProps = {
  loading: Ref<boolean>;
  begin: () => void;
  complete: () => void;
  process: () => void;
};

/** A simple hook to manage the sign in progress */
export default function (): SignInProgressProps {
  const loading = useLocalStorage('pseudorestapi-sign-in-loading', false);
  const toast = useToast();

  const display = (msg: string) => {
    toast.dark(msg);
  };

  const begin = () => {
    loading.value = true;
  };

  const complete = () => {
    if (loading.value) {
      loading.value = false;

      display('Successfully signed in');
    }
  };

  const process = () => {
    if (loading.value) {
      display('Signing in user...');

      setTimeout(
        () => display("It's taking us longer to sign you in..."),
        8000
      );
    }
  };

  return {
    /** PROPERTIES */
    loading,

    /** METHODS */
    begin,
    complete,
    process,
  };
}
