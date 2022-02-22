// @flow
import { mock, post } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import env from "config/env";

const { MOCK_API, API_URL } = env;

type RemoveSceneRequest = {
  production_id: string,
  id: string,
  scene_id: string
};

type RemoveSceneResponse = {
  id: string,
  version: number
};

const RemoveSceneResponseMock: RemoveSceneResponse = {
  id: "16CijCc65V8WrNKPow0nQ4GehWPA",
  version: 3
};

export type RemoveSceneInput = {
  productionId: number,
  shootingEventId: string,
  sceneId: string
};

export type RemoveSceneOutput = {
  id: string,
  version: number,
  sceneId: string
};

/**
 * encodes a `RemoveSceneInput` object to an api request.
 */
async function encoder(input: RemoveSceneInput): Promise<RemoveSceneRequest> {
  return {
    production_id: `${input.productionId}`,
    id: input.shootingEventId,
    scene_id: input.sceneId
  };
}

/**
 * decodes the api response to `RemoveSceneOutput`.
 */
async function decoder(
  res: RemoveSceneResponse,
  input: RemoveSceneInput
): Promise<RemoveSceneOutput> {
  const { sceneId } = input;
  return { ...res, sceneId };
}

/**
 * addScene adds a scene to a shooting event.
 */
export default async function addScene(
  input: RemoveSceneInput
): Promise<APIResponseType<RemoveSceneOutput>> {
  // eslint-disable-next-line camelcase
  const { production_id, ...req } = await encoder(input);

  const response = await (MOCK_API
    ? mock(RemoveSceneResponseMock)
    : // eslint-disable-next-line camelcase
      post(
        // eslint-disable-next-line camelcase
        `${API_URL}/v1/productions/${production_id}/shootingevents/delete_scene`,
        req
      ));

  const output: APIResponseType<RemoveSceneOutput> = {
    ...response,
    data: await decoder(response.data, input)
  };

  return output;
}
