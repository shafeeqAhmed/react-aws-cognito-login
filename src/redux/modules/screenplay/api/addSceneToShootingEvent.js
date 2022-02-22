// @flow
import { mock, post } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import type { ShootingEventSceneType } from "src/redux/modules/screenplay";
import env from "config/env";

const { MOCK_API, API_URL } = env;

type AddSceneRequest = {
  production_id: string,
  id: string,
  scene_id: string,
  scene_type: "PRIMARY" | "SECONDARY"
};

type AddSceneResponse = {
  id: string,
  version: number
};

const AddSceneResponseMock: AddSceneResponse = {
  id: "16CijCc65V8WrNKPow0nQ4GehWPA",
  version: 3
};

export type AddSceneInput = {
  productionId: number,
  shootingEventId: string,
  sceneId: string,
  sceneType: ShootingEventSceneType
};

export type AddSceneOutput = {
  id: string,
  version: number,
  sceneId: string,
  sceneType: ShootingEventSceneType
};

/**
 * encodes a `AddSceneInput` object to an api request.
 */
async function encoder(input: AddSceneInput): Promise<AddSceneRequest> {
  return {
    production_id: `${input.productionId}`,
    id: input.shootingEventId,
    scene_id: input.sceneId,
    scene_type: input.sceneType
  };
}

/**
 * decodes the api response to `AddSceneOutput`.
 */
async function decoder(
  res: AddSceneResponse,
  input: AddSceneInput
): Promise<AddSceneOutput> {
  const { sceneId, sceneType } = input;
  return { ...res, sceneId, sceneType };
}

/**
 * addScene adds a scene to a shooting event.
 */
export default async function addScene(
  input: AddSceneInput
): Promise<APIResponseType<AddSceneOutput>> {
  // eslint-disable-next-line camelcase
  const { production_id, ...req } = await encoder(input);

  const response = await (MOCK_API
    ? mock(AddSceneResponseMock)
    : // eslint-disable-next-line camelcase
      post(
        // eslint-disable-next-line camelcase
        `${API_URL}/v1/productions/${production_id}/shootingevents/add_scene`,
        req
      ));

  const output: APIResponseType<AddSceneOutput> = {
    ...response,
    data: await decoder(response.data, input)
  };

  return output;
}
