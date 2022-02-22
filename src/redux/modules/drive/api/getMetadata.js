// @flow
import { camelize, mock, post } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import type { File } from "../";
import env from "config/env";

const { MOCK_API, API_URL } = env;

type GetMetadataRequest = {
  production_id: string,
  id: string
};

type GetMetadataResponse = {
  file: {
    id: string,
    version: number,
    production_id: string,
    name: string,
    folder_id: ?string,
    file_path: string,
    file_size: number,
    file_type: "upload" | "screenplay" | "folder",
    screenplay_id: ?string,
    created_by: string,
    favorited_by: ?Array<string>,
    created_at: string,
    updated_at: string,
    deleted_at: ?string
  }
};

const GetMetadataResponseMock: GetMetadataResponse = {
  file: {
    id: "15IC9bZlPXzvQtrs1NfoxHQ9Get",
    version: 2,
    production_id: "2",
    name: "test_file",
    folder_id: null,
    file_path: "/15IC9bZlPXzvQtrs1NfoxHQ9Get",
    file_type: "upload",
    file_size: 1234,
    screenplay_id: null,
    created_by: "50393f98-fe11-47e9-a237-8ecde9b02690",
    favorited_by: ["50393f98-fe11-47e9-a237-8ecde9b02690"],
    created_at: "2018-05-29T19:27:58Z",
    updated_at: "2018-05-29T19:27:58Z",
    deleted_at: null
  }
};

export type GetMetadataInput = {
  productionId: number,
  fileId: string
};

export type GetMetadataOutput = {
  file: File
};

async function encoder(input: GetMetadataInput): Promise<GetMetadataRequest> {
  return {
    production_id: `${input.productionId}`,
    id: input.fileId
  };
}

/**
 * decodes the api response to `GetMetadataOutput`.
 */
async function decoder(res: GetMetadataResponse): Promise<GetMetadataOutput> {
  return {
    file: {
      ...camelize(res.file),
      productionId: parseInt(res.file.production_id, 10)
    }
  };
}

/**
 * getMetadata fetches information about a file.
 * @params productionId ID of the production
 * @params id of the screenplay
 */
export default (async function getMetadata(
  input: GetMetadataInput
): Promise<APIResponseType<GetMetadataOutput>> {
  // eslint-disable-next-line camelcase
  const { production_id, ...req } = await encoder(input);

  const response = await (MOCK_API
    ? mock(GetMetadataResponseMock)
    : post(
        // eslint-disable-next-line camelcase
        `${API_URL}/v1/productions/${production_id}/files/get_metadata`,
        req
      ));

  const output: APIResponseType<GetMetadataOutput> = {
    ...response,
    data: await decoder(response.data)
  };

  return output;
});
