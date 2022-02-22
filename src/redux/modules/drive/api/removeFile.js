// @flow
import { mock, post, camelize } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import type { File } from "../";
import env from "config/env";

const { MOCK_API, API_URL } = env;

type RemoveFileRequest = {
  production_id: string,
  id: string
};

type RemoveFileResponse = {
  id: string,
  version: number
};

const RemoveFileResponseMock: RemoveFileResponse = {
  id: "16q4jZz8QxQD6q3NI8W6QfIljgh",
  version: 1
};

export type RemoveFileInput = {
  productionId: number,
  fileId: string
};

export type RemoveFileOutput = {
  file: File
};

/**
 * encodes a `RemoveFile` object to an api request.
 */
async function encoder(input: RemoveFileInput): Promise<RemoveFileRequest> {
  return {
    production_id: `${input.productionId}`,
    id: input.fileId
  };
}

/**
 * decodes the api response to `RemoveFileOutput`.
 */
async function decoder(
  res: RemoveFileResponse,
  input: RemoveFileInput
): Promise<RemoveFileOutput> {
  return {
    file: {
      ...camelize(res),
      productionId: input.productionId
    }
  };
}

/**
 * removeFile marks a file or folder as Removed.
 */
export default async function removeFile(
  input: RemoveFileInput
): Promise<APIResponseType<RemoveFileOutput>> {
  // eslint-disable-next-line camelcase
  const { production_id, ...req } = await encoder(input);

  const response = await (MOCK_API
    ? mock(RemoveFileResponseMock)
    : post(
        // eslint-disable-next-line camelcase
        `${API_URL}/v1/productions/${production_id}/files/remove`,
        req
      ));

  const output: APIResponseType<RemoveFileOutput> = {
    ...response,
    data: await decoder(response.data, input)
  };

  return output;
}
