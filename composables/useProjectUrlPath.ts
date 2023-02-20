export default function (): string | void {
  const route = useRoute();

  if (typeof route.params.urlpath === 'string') {
    return route.params.urlpath;
  }
}
