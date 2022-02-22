// @flow
import { mock, post, camelize } from "src/helpers/api";
import { FileTypes } from "../";
import type { APIResponseType } from "src/helpers/api";
import type { File } from "../";
import env from "config/env";

const { MOCK_API, API_URL } = env;

type EndUploadRequest = {
  production_id: string,
  id: string,
  name: string,
  folder_id: ?string
};

type EndUploadResponse = {
  id: string,
  version: number
};

const EndUploadResponseMock: EndUploadResponse = {
  id: "16q4jZz8QxQD6q3NI8W6QfIljgh",
  version: 1
};

export type EndUploadInput = {
  productionId: number,
  fileId: string,
  name: string,
  folderId: ?string,
  fileSize: number
};

export type EndUploadOutput = {
  file: File
};

/**
 * encodes a `EndUploadInput` object to an api request.
 */
async function encoder(input: EndUploadInput): Promise<EndUploadRequest> {
  return {
    production_id: `${input.productionId}`,
    id: input.fileId,
    name: input.name,
    folder_id: input.folderId
  };
}

/**
 * decodes the api response to `EndUploadOutput`.
 */
async function decoder(
  res: EndUploadResponse,
  input: EndUploadInput
): Promise<EndUploadOutput> {
  return { file: { ...camelize(res), fileType: FileTypes.UPLOAD, ...input } };
}

/**
 * endUpload confirms a file was uploaded.
 */
export default async function endUpload(
  input: EndUploadInput
): Promise<APIResponseType<EndUploadOutput>> {
  // eslint-disable-next-line camelcase
  const { production_id, ...req } = await encoder(input);

  const response = await (MOCK_API
    ? mock(EndUploadResponseMock)
    : post(
        // eslint-disable-next-line camelcase
        `${API_URL}/v1/productions/${production_id}/files/end_upload`,
        req
      ));

  const output: APIResponseType<EndUploadOutput> = {
    ...response,
    data: await decoder(response.data, input)
  };

  return output;
}
