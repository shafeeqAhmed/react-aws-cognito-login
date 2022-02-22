// @flow
import { mock, post, camelize } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import type { File } from "../";
import env from "config/env";

const { MOCK_API, API_URL } = env;

type ListRecentRequest = {
  production_id: string,
  limit: number,
  offset: number
};

type ListRecentResponse = {
  entries: Array<{
    id: string,
    version: number,
    production_id: string,
    name: string,
    folder_id: string,
    file_path: string,
    file_type: "upload" | "screenplay" | "folder",
    file_size: number,
    screenplay_id: ?string,
    created_by: string,
    favorited_by: ?Array<string>,
    created_at: string,
    updated_at: string,
    deleted_at: ?string
  }>,
  limit: number,
  offset: number
};

const ListRecentResponseMock: ListRecentResponse = {
  entries: [
    {
      id: "15ICCCv0cTk9XGXrpXQEIkivCGb",
      version: 2,
      production_id: "2",
      name: "subfile",
      folder_id: "15ICCHAO238fSElKtuiDya5DucM",
      file_path: "/15ICCHAO238fSElKtuiDya5DucM/15ICCCv0cTk9XGXrpXQEIkivCGb",
      file_type: "upload",
      file_size: 234,
      screenplay_id: null,
      created_by: "50393f98-fe11-47e9-a237-8ecde9b02690",
      favorited_by: ["50393f98-fe11-47e9-a237-8ecde9b02690"],
      created_at: "2018-05-29T19:28:19Z",
      updated_at: "2018-05-29T19:28:19Z",
      deleted_at: null
    },
    {
      id: "15ICCFTIoqftEZlYCZgbMDVWsfC",
      version: 1,
      production_id: "2",
      name: "subfolder",
      folder_id: "15ICCHAO238fSElKtuiDya5DucM",
      file_path: "/15ICCHAO238fSElKtuiDya5DucM/15ICCFTIoqftEZlYCZgbMDVWsfC",
      file_type: "folder",
      file_size: 23454,
      screenplay_id: null,
      created_by: "50393f98-fe11-47e9-a237-8ecde9b02690",
      favorited_by: ["50393f98-fe11-47e9-a237-8ecde9b02690"],
      created_at: "2018-05-29T19:28:18Z",
      updated_at: "2018-05-29T19:28:18Z",
      deleted_at: null
    }
  ],
  limit: 10,
  offset: 0
};

export type ListRecentInput = {
  productionId: number,
  limit?: number,
  offset?: number
};

export type ListRecentOutput = {
  files: Array<File>,
  limit: number,
  offset: number
};

/**
 * encodes a `ListRecentInput` object to an api request.
 */
async function encoder(input: ListRecentInput): Promise<ListRecentRequest> {
  return {
    production_id: `${input.productionId}`,
    limit: typeof input.limit === "undefined" ? 100 : input.limit,
    offset: typeof input.offset === "undefined" ? 0 : input.offset
  };
}

/**
 * decodes the api response to `ListFavoritesOutput`.
 */
async function decoder(res: ListRecentResponse): Promise<ListRecentOutput> {
  const { entries, ...r } = res;
  const files: Array<File> = entries.map(e => ({
    ...camelize(e),
    productionId: parseInt(e.production_id, 10)
  }));
  return { ...r, files };
}

/**
 * listFavorites returns a paginated list of files the authenticated user has favorited.
 */
export default async function listFavorites(
  input: ListRecentInput
): Promise<APIResponseType<ListRecentOutput>> {
  // eslint-disable-next-line camelcase
  const { production_id, ...req } = await encoder(input);

  const response = await (MOCK_API
    ? mock(ListRecentResponseMock)
    : post(
        // eslint-disable-next-line camelcase
        `${API_URL}/v1/productions/${production_id}/files/list_recent`,
        req
      ));

  const output: APIResponseType<ListRecentOutput> = {
    ...response,
    data: await decoder(response.data)
  };

  return output;
}
