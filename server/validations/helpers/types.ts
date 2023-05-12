export type ValidationValue =
  | string
  | boolean
  | number
  | { [key: string]: ValidationValue }
  | ValidationValue[];

export type ValidationDependencies = {
  set?: ValidationValue[];
};
