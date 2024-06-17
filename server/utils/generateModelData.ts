import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

export const FAKER_OPTIONS = {
  faker_animal: {
    text: 'Animal',
    value: 'faker_animal',
    set: () => faker.animal.type(),
  },
  faker_city: {
    text: 'City',
    value: 'faker_city',
    set: () => faker.location.city(),
  },
  faker_color: {
    text: 'Color',
    value: 'faker_color',
    set: () => faker.color.human(),
  },
  faker_country: {
    text: 'Country',
    value: 'faker_country',
    set: () => faker.location.country(),
  },
  faker_date: {
    text: 'Date',
    value: 'faker_date',
    set: () => faker.date.anytime().toISOString().substring(0, 10),
  },
  faker_email_address: {
    text: 'Email',
    value: 'faker_email_address',
    set: () => faker.internet.email(),
  },
  faker_full_name: {
    text: 'Full name',
    value: 'faker_full_name',
    set: () => faker.person.fullName(),
  },
  faker_job: {
    text: 'Job',
    value: 'faker_job',
    set: () => faker.person.jobType(),
  },
  faker_phone_number: {
    text: 'Phone number',
    value: 'faker_phone_number',
    set: () => faker.phone.number(),
  },
  faker_product_name: {
    text: 'Product name',
    value: 'faker_product_name',
    set: () => faker.commerce.productName(),
  },
  faker_product: {
    text: 'Product',
    value: 'faker_product',
    set: () => faker.commerce.product(),
  },
  faker_street: {
    text: 'Street Address',
    value: 'faker_street',
    set: () => faker.location.streetAddress(),
  },
  faker_vehicle_manufacturer: {
    text: 'Vehicle manufacturer',
    value: 'faker_vehicle_manufacturer',
    set: () => faker.vehicle.manufacturer(),
  },
  faker_vehicle: {
    text: 'Vehicle',
    value: 'faker_vehicle',
    set: () => faker.vehicle.type(),
  },
};

type FakeSchema = {
  max?: number;
  min?: number;
  name: string;
  option: string;
  range: {
    start: string;
    end: string;
  };
  type: string;
};

type FakerType = keyof typeof FAKER_OPTIONS;

function setValue(schema: FakeSchema) {
  switch (schema.type) {
    case 'string':
      return FAKER_OPTIONS[schema.option as FakerType].set();
    case 'number':
      return faker.number.int({ min: schema.min, max: schema.max });
    case 'uuid':
      return uuidv4();
    case 'boolean':
      return faker.datatype.boolean();
    case 'timestamp':
      return faker.date.between({
        from: schema.range.start,
        to: schema.range.end,
      });
  }
}

export default function (schema: FakeSchema[], total: number) {
  const data = [];

  while (data.length < total) {
    data.push(
      schema.reduce<any>((obj, cur) => {
        obj[cur.name] = setValue(cur);
        return obj;
      }, {})
    );
  }

  return data;
}
