export type Structure = {
  [key: string]: {
    name: string;
    type: string;
    default?: string;
  };
};

export type CreateResourceModelForm = {
  name: string;
  structure: Structure;
};
