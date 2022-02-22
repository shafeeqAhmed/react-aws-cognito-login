// @flow
import { mock, post, camelize } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import type { File } from "../";
import env from "config/env";

const { MOCK_API, API_URL } = env;

type ToggleFavoriteRequest = {
  production_id: string,
  id: string
};

type ToggleFavoriteResponse = {
  id: string,
  version: number
};

const ToggleFavoriteResponseMock: ToggleFavoriteResponse = {
  id: "15ICCCv0cTk9XGXrpXQEIkivCGb",
  version: 2
};

export type ToggleFavoriteInput = {
  productionId: number,
  fileId: string,
  favorite: boolean
};

export type ToggleFavoriteOutput = {
  file: $Shape<File>
};

/**
 * encodes a `ToggleFavoriteInput` object to an api request.
 */
async function encoder(
  input: ToggleFavoriteInput
): Promise<ToggleFavoriteRequest> {
  return {
    production_id: `${input.productionId}`,
    id: input.fileId
  };
}

/**
 * decodes the api response to `ToggleFavoriteOutput`.
 */
async function decoder(
  res: ToggleFavoriteResponse,
  input: ToggleFavoriteInput
): Promise<ToggleFavoriteOutput> {
  return { file: camelize(res) };
}

/**
 * toggleFavorite favorites or unfavorites a file.
 */
export default async function toggleFavorite(
  input: ToggleFavoriteInput
): Promise<APIResponseType<ToggleFavoriteOutput>> {
  // eslint-disable-next-line camelcase
  const { production_id, ...req } = await encoder(input);

  const response = await (MOCK_API
    ? mock(ToggleFavoriteResponseMock)
    : post(
        // eslint-disable-next-line camelcase
        `${API_URL}/v1/productions/${production_id}/files/${
          input.favorite ? "favorite" : "unfavorite"
        }`,
        req
      ));

  const output: APIResponseType<ToggleFavoriteOutput> = {
    ...response,
    data: await decoder(response.data, input)
  };

  return output;
}
