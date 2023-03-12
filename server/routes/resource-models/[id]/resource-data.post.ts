import { H3Event } from 'h3';
import { v4 as uuidv4 } from 'uuid';
import ErrorResponse from '../../../utils/errorResponse';
import { ResourceDataServices, ResourceModelServices } from '../../../services';
import { PostResourceDataValidation } from '~~/server/validations';

type BodyParams = {
  count: number;
};

type Entry = { [key: string]: string | number | boolean };

function validate(body: BodyParams, event: H3Event): void | never {
  if (event.context.auth.error) {
    throw event.context.auth.error;
  }

  const error = new PostResourceDataValidation(body).validate();

  if (error) {
    throw error;
  }
}

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

function generateData(count: number, structure: Structure[]) {
  const data: Entry[] = [];

  while (data.length < count) {
    const entry: Entry = {};

    structure.forEach((field) => {
      entry[field.id] = setValue(field);
    });

    data.push(entry);
  }

  return data;
}

export default defineEventHandler(async (event) => {
  const body = await readBody<BodyParams>(event);

  validate(body, event);

  const resourceModel = await new ResourceModelServices(event).find(
    event.context.params.id
  );

  if (resourceModel === null) {
    throw ErrorResponse.badRequest('Resource model does not exist.');
  }

  return await new ResourceDataServices(event).create({
    data: generateData(body.count, resourceModel.structure),
    resourceModelId: resourceModel.id,
  });
});
