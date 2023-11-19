import { faker } from '@faker-js/faker';

// const DataOptions = {
//   string: {
//     animal: 'Animal',
//     city: 'City',
//     color: 'Color',
//     country: 'Country',
//     date: 'Date',
//     email_address: 'Email Address',
//   }
// };

export default function (option: string) {
  switch (option) {
    case 'faker_animal':
      return faker.animal.type();
    case 'faker_city':
      return faker.location.city();
    case 'faker_color':
      return faker.color.human();
    case 'faker_country':
      return faker.location.country();
    case 'faker_date':
      return faker.date.anytime().toISOString().substring(0, 10);
    case 'faker_email_address':
      return faker.internet.email();
    case 'faker_full_name':
      return faker.person.fullName();
    case 'faker_job':
      return faker.person.jobType();
    case 'faker_phone_number':
      return faker.phone.number();
    case 'faker_price':
      return Number(faker.commerce.price());
    case 'faker_product_name':
      return faker.commerce.productName();
    case 'faker_product':
      return faker.commerce.product();
    case 'faker_street':
      return faker.location.streetAddress();
    case 'faker_vehicle_manufacturer':
      return faker.vehicle.manufacturer();
    case 'faker_vehicle':
      return faker.vehicle.type();
    default:
      throw new Error(`The faker option ${option} does not exists.`);
  }
}
