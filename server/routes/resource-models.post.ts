import { H3Event } from 'h3';
import { v4 as uuidv4 } from 'uuid';
import { PostResourceModelValidation } from '../validations';
import { ProjectKeyRepository, ResourceModelRepository } from '../repositories';
import { ProjectKeyWithProject, ResourceModel } from '~~/types/models';

type BodyParams = {
  name: string;
  projectApiKey: string;
  structure: {
    default: string | number | boolean;
    name: string;
    type: string;
  }[];
};

type Payload = {
  body: BodyParams;
  event: H3Event;
  projectKey?: ProjectKeyWithProject;
};

export default defineEventHandler(async (event) => {
  const payload: Payload = {
    body: await readBody<BodyParams>(event),
    event,
  };

  validate(payload);

  payload.projectKey = await getProjectKey(payload);

  await existingResourceModel(payload);

  return await insertResourceModel(payload);
});

function validate({ body, event }: Payload): void | never {
  if (event.context.auth.error) {
    throw event.context.auth.error;
  }

  const error = new PostResourceModelValidation(body).validate();

  if (error) {
    throw error;
  }
}

async function getProjectKey({
  body,
  event,
}: Payload): Promise<ProjectKeyWithProject | never> {
  const projectKeys = await new ProjectKeyRepository(event).get(
    {
      api_key: body.projectApiKey,
    },
    '*, projects(*)'
  );

  if (projectKeys.error instanceof Error) {
    throw projectKeys.error;
  }

  return projectKeys.data![0];
}

async function existingResourceModel({
  body,
  event,
  projectKey,
}: Payload): Promise<void | never> {
  const resourceModels = await new ResourceModelRepository(event).get({
    name: body.name,
    is_deleted: false,
    project_id: projectKey!.projects.id,
  });

  if (resourceModels.error instanceof Error) {
    throw resourceModels.error;
  }

  if (resourceModels.data!.length > 0) {
    throw createError({
      statusCode: HTTP_STATUS_BAD_REQUEST,
      statusMessage: 'Resource model already exists.',
    });
  }
}

async function insertResourceModel({
  body,
  event,
  projectKey,
}: Payload): Promise<ResourceModel | never> {
  const structure = body.structure.map((item) => {
    const coercedValue = coerce(item.type, item.default);

    if (coercedValue !== null) {
      item.default = coercedValue;
    }

    return {
      ...item,
      id: uuidv4(),
    };
  });

  const resourceModels = await new ResourceModelRepository(event).insert({
    id: uuidv4(),
    name: body.name,
    structure,
    project_id: projectKey!.projects.id,
    user_id: event.context.auth.user.id,
  });

  if (resourceModels.error instanceof Error) {
    throw resourceModels.error;
  }

  return resourceModels.data![0];
}
