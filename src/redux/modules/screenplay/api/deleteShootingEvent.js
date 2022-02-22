// @flow
import { mock, post, camelize } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import env from "config/env";

const { MOCK_API, API_URL } = env;

type DeleteRequest = {
  production_id: string,
  id: string
};

type DeleteResponse = {
  id: string,
  version: number
};

const DeleteResponseMock: DeleteResponse = {
  id: "16YnZJev9Ks840i9l5idJidDvHL",
  version: 2
};

export type DeleteInput = {
  productionId: number,
  shootingEventId: string
};

export type DeleteOutput = {
  id: string,
  version: number
};

/**
 * encodes a `DeleteInput` object to an api request.
 */
async function encoder(input: DeleteInput): Promise<DeleteRequest> {
  return {
    production_id: `${input.productionId}`,
    id: input.shootingEventId
  };
}

/**
 * decodes the api response to `DeleteOutput`.
 */
async function decoder(res: DeleteResponse): Promise<DeleteOutput> {
  return camelize(res);
}

/**
 * Delete deletes a shooting event.
 */
export default async function split(
  input: DeleteInput
): Promise<APIResponseType<DeleteOutput>> {
  // eslint-disable-next-line camelcase
  const { production_id, ...req } = await encoder(input);

  const response = await (MOCK_API
    ? mock(DeleteResponseMock)
    : // eslint-disable-next-line camelcase
      post(
        // eslint-disable-next-line camelcase
        `${API_URL}/v1/productions/${production_id}/shootingevents/delete`,
        req
      ));

  const output: APIResponseType<DeleteOutput> = {
    ...response,
    data: await decoder(response.data)
  };

  return output;
}
