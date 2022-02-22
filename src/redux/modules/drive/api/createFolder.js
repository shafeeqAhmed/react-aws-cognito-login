// @flow
import { mock, post, camelize } from "src/helpers/api";
import { FileTypes } from "../";
import type { APIResponseType } from "src/helpers/api";
import type { File } from "../";
import env from "config/env";

const { MOCK_API, API_URL } = env;

type CreateFolderRequest = {
  production_id: string,
  name: string,
  folder_id: ?string
};

type CreateFolderResponse = {
  id: string,
  version: number
};

const CreateFolderResponseMock: CreateFolderResponse = {
  id: "16q4jZz8QxQD6q3NI8W6QfIljgh",
  version: 1
};

export type CreateFolderInput = {
  productionId: number,
  name: string,
  folderId?: string
};

export type CreateFolderOutput = {
  file: File
};

/**
 * encodes a `CreateFoldert` object to an api request.
 */
async function encoder(input: CreateFolderInput): Promise<CreateFolderRequest> {
  return {
    production_id: `${input.productionId}`,
    name: input.name,
    folder_id: input.folderId
  };
}

/**
 * decodes the api response to `CreateFolderOutput`.
 */
async function decoder(
  res: CreateFolderResponse,
  input: CreateFolderInput
): Promise<CreateFolderOutput> {
  return { file: { ...camelize(res), fileType: FileTypes.FOLDER, ...input } };
}

/**
 * createFolder creates a new folder.
 */
export default async function createFolder(
  input: CreateFolderInput
): Promise<APIResponseType<CreateFolderOutput>> {
  // eslint-disable-next-line camelcase
  const { production_id, ...req } = await encoder(input);

  const response = await (MOCK_API
    ? mock(CreateFolderResponseMock)
    : post(
        // eslint-disable-next-line camelcase
        `${API_URL}/v1/productions/${production_id}/files/create_folder`,
        req
      ));

  const output: APIResponseType<CreateFolderOutput> = {
    ...response,
    data: await decoder(response.data, input)
  };

  return output;
}
