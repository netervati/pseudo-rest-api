export default function (): string {
  const route = useRoute();

  if (typeof route.params.urlpath === 'string') {
    return route.params.urlpath;
  }

  return '';
}
