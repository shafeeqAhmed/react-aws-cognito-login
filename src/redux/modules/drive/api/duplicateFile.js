// @flow
import { mock, post, camelize } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import type { File } from "../";
import env from "config/env";

const { MOCK_API, API_URL } = env;

type DuplicateFileRequest = {
  production_id: string,
  id: string,
  name: string,
  folder_id: ?string
};

type DuplicateFileResponse = {
  id: string,
  version: number
};

const DuplicateFileResponseMock: DuplicateFileResponse = {
  id: "16q4jZz8QxQD6q3NI8W6QfIljgh",
  version: 1
};

export type DuplicateFileInput = {
  productionId: number,
  fileId: string,
  name: string,
  folderId: ?string
};

export type DuplicateFileOutput = {
  file: File
};

/**
 * encodes a `DuplicateFile` object to an api request.
 */
async function encoder(
  input: DuplicateFileInput
): Promise<DuplicateFileRequest> {
  return {
    production_id: `${input.productionId}`,
    id: input.fileId,
    name: input.name,
    folder_id: input.folderId
  };
}

/**
 * decodes the api response to `DuplicateFileOutput`.
 */
async function decoder(
  res: DuplicateFileResponse,
  input: DuplicateFileInput
): Promise<DuplicateFileOutput> {
  const createdAt = new Date().toISOString();

  return {
    file: {
      ...camelize(res),
      productionId: input.productionId,
      name: input.name,
      folderId: input.folderId,
      createdAt,
      updatedAt: createdAt
    }
  };
}

/**
 * duplicateFile marks a file or folder as Duplicated.
 */
export default async function duplicateFile(
  input: DuplicateFileInput
): Promise<APIResponseType<DuplicateFileOutput>> {
  // eslint-disable-next-line camelcase
  const { production_id, ...req } = await encoder(input);

  const response = await (MOCK_API
    ? mock(DuplicateFileResponseMock)
    : post(
        // eslint-disable-next-line camelcase
        `${API_URL}/v1/productions/${production_id}/files/duplicate`,
        req
      ));

  const output: APIResponseType<DuplicateFileOutput> = {
    ...response,
    data: await decoder(response.data, input)
  };

  return output;
}
