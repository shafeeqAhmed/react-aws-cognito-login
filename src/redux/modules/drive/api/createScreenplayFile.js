// @flow
import { mock, post, camelize } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import type { File } from "../";
import env from "config/env";

const { MOCK_API, API_URL } = env;

type CreateScreenplayFileRequest = {
  production_id: string,
  name: string,
  folder_id: ?string
};

type CreateScreenplayFileResponse = {
  id: string,
  version: number
};

const CreateScreenplayFileResponseMock: CreateScreenplayFileResponse = {
  id: "15ICCXfxfDsU2l2zSa3gkECGo58",
  version: 1
};

export type CreateScreenplayFileInput = {
  productionId: number,
  name: string,
  folderId?: string
};

export type CreateScreenplayFileOutput = {
  file: File
};

/**
 * encodes a `CreateScreenplayInput` object to an api request.
 */
async function encoder(
  input: CreateScreenplayFileInput
): Promise<CreateScreenplayFileRequest> {
  return {
    production_id: `${input.productionId}`,
    name: input.name,
    folder_id: input.folderId
  };
}

/**
 * decodes the api response to `CreateScreenplayOutput`.
 */
async function decoder(
  res: CreateScreenplayFileResponse
): Promise<CreateScreenplayFileOutput> {
  return { file: camelize(res) };
}

/**
 * createScreenplayFile creates a new screenplay
 */
export default async function createScreenplayFile(
  input: CreateScreenplayFileInput
): Promise<APIResponseType<CreateScreenplayFileOutput>> {
  // eslint-disable-next-line camelcase
  const { production_id, ...req } = await encoder(input);

  const response = await (MOCK_API
    ? mock(CreateScreenplayFileResponseMock)
    : post(
        // eslint-disable-next-line camelcase
        `${API_URL}/v1/productions/${production_id}/files/create_screenplay_file`,
        req
      ));

  const output: APIResponseType<CreateScreenplayFileOutput> = {
    ...response,
    data: await decoder(response.data)
  };

  return output;
}
