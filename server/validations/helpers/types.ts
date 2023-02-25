export type ValidationValue =
  | string
  | boolean
  | number
  | { [key: string]: ValidationValue };
