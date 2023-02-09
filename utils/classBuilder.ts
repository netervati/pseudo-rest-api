/**
 * A simple helper function that merges css classes
 *
 * @example
 *   const isLoading = true;
 *
 *   classBuilder('bg-slate-900', {
 *     'p-6': isLoading,
 *   });
 *
 * @param baseClass
 * @param addOns
 *
 * @returns
 **/
export default function (
  baseClass: string,
  addOns: { [key: string]: boolean | undefined }
) {
  let mergedClass = baseClass;

  Object.keys(addOns).forEach((key) => {
    if (addOns[key]) {
      mergedClass = `${mergedClass} ${key}`;
    }
  });

  return mergedClass;
}
