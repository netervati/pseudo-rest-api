/**
 * Capitalizes the first letter of the string.
 *
 * @param argument
 * @returns 
 */
export default function (argument: string): string {
  return argument.replace(/^./, argument[0].toUpperCase());
}
