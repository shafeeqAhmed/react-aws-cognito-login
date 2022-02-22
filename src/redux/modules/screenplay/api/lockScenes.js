// @flow
import { mock, post } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import env from "config/env";

const { MOCK_API, API_URL } = env;

type LockScenesRequest = {
  production_id: string,
  id: string
};

type LockScenesResponse = {
  // empty response
};

const LockScenesResponseMock: LockScenesResponse = {
  // empty mock
};

export type LockScenesInput = {
  productionId: string,
  screenplayId: string
};

export type LockScenesOutput = {
  // empty output
};

/**
 * encodes a domain model input into an api request.
 */
async function encoder(input: LockScenesInput): Promise<LockScenesRequest> {
  return {
    production_id: input.productionId,
    id: input.screenplayId
  };
}

/**
 * decodes an api response to a domain model output.
 */
async function decoder(res: LockScenesResponse): Promise<LockScenesOutput> {
  return res || {};
}

/**
 * lockScenes lists the scenes in a screenplay.
 */
export default (async function lockScenes(
  input: LockScenesInput
): Promise<APIResponseType<LockScenesOutput>> {
  // eslint-disable-next-line camelcase
  const { production_id, ...req } = await encoder(input);

  const response = await (MOCK_API
    ? mock(LockScenesResponseMock)
    : post(
        // eslint-disable-next-line camelcase
        `${API_URL}/v1/productions/${production_id}/screenplays/lock_scenes`,
        req
      ));

  const output: APIResponseType<LockScenesOutput> = {
    ...response,
    data: await decoder(response.data)
  };

  return output;
});
