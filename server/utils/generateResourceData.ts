import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

type Entry = { [key: string]: string | number | boolean };

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
    case 'faker_date':
      return faker.date.anytime().toISOString().substring(0, 10);
    case 'faker_email_address':
      return faker.internet.email();
    case 'faker_full_name':
      return faker.person.fullName();
    case 'faker_price':
      return Number(faker.commerce.price());
    case 'faker_product_name':
      return faker.commerce.productName();
    case 'faker_product':
      return faker.commerce.product();
    default:
      return field.default;
  }
}

export default function (structure: Structure[], existingEntry: Entry = {}) {
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
