// @flow
import { mock, post, camelize } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import type { File } from "../";
import env from "config/env";

const { MOCK_API, API_URL } = env;

type DeleteFileRequest = {
  production_id: string,
  id: string
};

type DeleteFileResponse = {
  id: string,
  version: number
};

const DeleteFileResponseMock: DeleteFileResponse = {
  id: "16q4jZz8QxQD6q3NI8W6QfIljgh",
  version: 1
};

export type DeleteFileInput = {
  productionId: number,
  fileId: string
};

export type DeleteFileOutput = {
  file: File
};

/**
 * encodes a `DeleteFile` object to an api request.
 */
async function encoder(input: DeleteFileInput): Promise<DeleteFileRequest> {
  return {
    production_id: `${input.productionId}`,
    id: input.fileId
  };
}

/**
 * decodes the api response to `DeleteFileOutput`.
 */
async function decoder(
  res: DeleteFileResponse,
  input: DeleteFileInput
): Promise<DeleteFileOutput> {
  return {
    file: {
      ...camelize(res),
      productionId: input.productionId,
      deletedAt: new Date().toISOString()
    }
  };
}

/**
 * deleteFile marks a file or folder as deleted.
 */
export default async function deleteFile(
  input: DeleteFileInput
): Promise<APIResponseType<DeleteFileOutput>> {
  // eslint-disable-next-line camelcase
  const { production_id, ...req } = await encoder(input);

  const response = await (MOCK_API
    ? mock(DeleteFileResponseMock)
    : post(
        // eslint-disable-next-line camelcase
        `${API_URL}/v1/productions/${production_id}/files/delete`,
        req
      ));

  const output: APIResponseType<DeleteFileOutput> = {
    ...response,
    data: await decoder(response.data, input)
  };

  return output;
}
