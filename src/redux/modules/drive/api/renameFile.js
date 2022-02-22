// @flow
import { mock, post } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import type { File } from "../";
import env from "config/env";

const { MOCK_API, API_URL } = env;

type RenameFileRequest = {
  production_id: string,
  id: string,
  name: string
};

type RenameFileResponse = {
  id: string,
  version: number
};

const RenameFileResponseMock: RenameFileResponse = {
  id: "16q4jAHAxzrfF5B5fRSogL77NAY",
  version: 2
};

export type RenameFileInput = {
  productionId: number,
  fileId: string,
  name: string
};

export type RenameFileOutput = {
  file: $Shape<{ ...File }>
};

/**
 * encodes a `RenameFile` object to an api request.
 */
async function encoder(input: RenameFileInput): Promise<RenameFileRequest> {
  return {
    production_id: `${input.productionId}`,
    id: input.fileId,
    name: input.name
  };
}

/**
 * decodes the api response to `RenameFileOutput`.
 */
async function decoder(
  res: RenameFileResponse,
  input: RenameFileInput
): Promise<RenameFileOutput> {
  return {
    file: { ...res, productionId: input.productionId, name: input.name }
  };
}

/**
 * renameFile moves files to a folder.
 */
export default async function renameFile(
  input: RenameFileInput
): Promise<APIResponseType<RenameFileOutput>> {
  // eslint-disable-next-line camelcase
  const { production_id, ...req } = await encoder(input);

  const response = await (MOCK_API
    ? mock(RenameFileResponseMock)
    : post(
        // eslint-disable-next-line camelcase
        `${API_URL}/v1/productions/${production_id}/files/rename`,
        req
      ));

  const output: APIResponseType<RenameFileOutput> = {
    ...response,
    data: await decoder(response.data, input)
  };

  return output;
}
