import { H3Event } from 'h3';
import { v4 as uuidv4 } from 'uuid';
import { postResourceModelValidation } from '../validations';
import { ProjectKeyRepository, ResourceModelRepository } from '../repositories';
import { ProjectKeyWithProject, ResourceModel } from '~~/types/models';

type BodyParams = {
  projectApiKey: string;
  structure: {
    [key: string]: {
      type: string;
    };
  };
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

  return {
    attributes: await insertResourceModel(payload),
  };
});

function validate({ body, event }: Payload): void | never {
  if (event.context.auth.error) {
    throw event.context.auth.error;
  }

  const error = postResourceModelValidation({
    structure: body.structure,
  });

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

async function insertResourceModel({
  body,
  event,
  projectKey,
}: Payload): Promise<ResourceModel | never> {
  const resourceModels = await new ResourceModelRepository(event).insert({
    id: uuidv4(),
    structure: body.structure,
    project_id: projectKey!.projects.id,
    user_id: event.context.auth.user.id,
  });

  if (resourceModels.error instanceof Error) {
    throw resourceModels.error;
  }

  return resourceModels.data![0];
}
