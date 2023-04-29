import { v4 as uuidv4 } from 'uuid';

export type Entry = { [key: string]: string | number | boolean };

type Structure = {
  id: string;
  default: string | number | boolean;
  name: string;
  type: string;
};

function setValue(field: Structure): string | number | boolean {
  const randNum = () =>
    new Date().getTime().toString() + Math.floor(Math.random() * 1000000);

  if (field.name === 'id') {
    return field.type === 'data_type_number' ? randNum() : uuidv4();
  }

  switch (field.type) {
    case 'data_type_uuid':
      return uuidv4();
    default:
      return field.default;
  }
}

export function generateResourceData(
  structure: Structure[],
  existingEntry: Entry = {}
) {
  const entry: Entry = {};

  structure.forEach((field) => {
    if (field.id in existingEntry) {
      entry[field.id] = existingEntry[field.id];
    } else {
      entry[field.id] = setValue(field);
    }
  });

  return entry;
}
