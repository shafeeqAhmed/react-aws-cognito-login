// @flow

import { post, mock, camelize } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import type { File } from "../";
import env from "config/env";

const { MOCK_API, API_URL } = env;

type RestoreFileRequest = {
  production_id: string,
  id: string
};

type RestoreFileResponse = {
  id: string,
  version: number
};

const RestoreFileResponseMock: RestoreFileResponse = {
  id: "16q4jZz8QxQD6q3NI8W6QfIljgh",
  version: 1
};

export type RestoreFileInput = {
  productionId: number,
  fileId: string
};

export type RestoreFileOutput = {
  file: File
};

/**
 * encodes a `RestoreFile` object to an api request.
 */
async function encoder(input: RestoreFileInput): Promise<RestoreFileRequest> {
  return {
    production_id: `${input.productionId}`,
    id: input.fileId
  };
}

/**
 * decodes the api response to `RestoreFileOutput`.
 */
async function decoder(
  res: RestoreFileResponse,
  input: RestoreFileInput
): Promise<RestoreFileOutput> {
  return {
    file: {
      ...camelize(res),
      productionId: input.productionId,
      deletedAt: undefined
    }
  };
}

/**
 * restoreFile restores files that were deleted.
 */
export default async function restoreFile(
  input: RestoreFileInput
): Promise<APIResponseType<RestoreFileOutput>> {
  // eslint-disable-next-line camelcase
  const { production_id, ...req } = await encoder(input);

  const response = await (MOCK_API
    ? mock(RestoreFileResponseMock)
    : post(
        // eslint-disable-next-line camelcase
        `${API_URL}/v1/productions/${production_id}/files/restore`,
        req
      ));

  const output: APIResponseType<RestoreFileOutput> = {
    ...response,
    data: await decoder(response.data, input)
  };

  return output;
}
