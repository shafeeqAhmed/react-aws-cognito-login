// @flow
import { mock, post } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import type { File } from "../";
import env from "config/env";

const { MOCK_API, API_URL } = env;

type MoveFilesRequest = {
  production_id: string,
  ids: Array<string>,
  folder_id: string
};

type MoveFilesResponse = {
  files_moved: Array<{
    id: string,
    version: number
  }>,
  files_not_moved: Array<{
    id: string,
    reason: string
  }>
};

const MoveFilesResponseMock: MoveFilesResponse = {
  files_moved: [
    {
      id: "16q4jAHAxzrfF5B5fRSogL77NAY",
      version: 2
    }
  ],
  files_not_moved: [
    {
      id: "16q4jEj9dH9PPIaRU7h54mBL9bT",
      reason: "file not found"
    }
  ]
};

export type MoveFilesInput = {
  productionId: number,
  fileIds: Array<string>,
  folderId: string
};

export type MoveFilesOutput = {
  files: Array<$Shape<{ ...File }>>,
  errors: Array<{ file: $Shape<{ ...File }>, reason: string }>
};

/**
 * encodes a `MoveFiles` object to an api request.
 */
async function encoder(input: MoveFilesInput): Promise<MoveFilesRequest> {
  return {
    production_id: `${input.productionId}`,
    ids: input.fileIds,
    folder_id: input.folderId
  };
}

/**
 * decodes the api response to `MoveFilesOutput`.
 */
async function decoder(
  res: MoveFilesResponse,
  input: MoveFilesInput
): Promise<MoveFilesOutput> {
  const moved: Array<$Shape<{ ...File }>> = res.files_moved.map(f => ({
    id: f.id,
    version: f.version,
    folderId: input.folderId,
    productionId: input.productionId
  }));

  const errors = res.files_not_moved.map(f => ({
    file: {
      id: f.id,
      productionId: input.productionId
    },
    reason: f.reason
  }));

  const filesWithErrors = errors.map(e => e.file);

  const files = moved.concat(filesWithErrors);

  return { files, errors };
}

/**
 * moveFiles moves files to a folder.
 */
export default async function moveFiles(
  input: MoveFilesInput
): Promise<APIResponseType<MoveFilesOutput>> {
  // eslint-disable-next-line camelcase
  const { production_id, ...req } = await encoder(input);

  const response = await (MOCK_API
    ? mock(MoveFilesResponseMock)
    : post(
        // eslint-disable-next-line camelcase
        `${API_URL}/v1/productions/${production_id}/files/move`,
        req
      ));

  const output: APIResponseType<MoveFilesOutput> = {
    ...response,
    data: await decoder(response.data, input)
  };

  return output;
}
