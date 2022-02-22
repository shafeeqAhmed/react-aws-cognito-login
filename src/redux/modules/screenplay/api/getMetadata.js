// @flow
import { camelize, mock, post } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import type { Metadata } from "src/redux/modules/screenplay";
import env from "config/env";

const { MOCK_API, API_URL } = env;

type GetMetadataResponse = {
  screenplay: {
    id: string,
    version: number,
    production_id: string,
    file_id: string,
    version_code: ?string,
    status: string,
    last_resolution: ?string,
    created_by: string,
    created_at: string,
    updated_at: string,
    deleted_at: ?string,
    removed_at: ?string
  }
};

const GetMetadataResponseMock: GetMetadataResponse = {
  screenplay: {
    id: "149hcdWTyC1dY4dOSt4f4uoWsXN",
    version: 1,
    production_id: "1",
    file_id: "149hccMZmPDBIBc2opnwbryfcEW",
    version_code: null,
    status: "draft",
    last_resolution: null,
    created_by: "018d1622-8b2d-41a2-9c04-ec5ba7e5ca32",
    created_at: "2018-05-04T20:30:05Z",
    updated_at: "2018-05-04T20:30:05Z",
    deleted_at: null,
    removed_at: null
  }
};

export type GetMetadataInput = {
  productionId: string,
  id: string
};

export type GetMetadataOutput = {
  metadata: Metadata
};

/**
 * decodes the api response to `GetMetadataOutput`.
 */
async function decoder(res: GetMetadataResponse): Promise<GetMetadataOutput> {
  return {
    metadata: {
      ...camelize(res.screenplay),
      productionId: parseInt(res.screenplay.production_id, 10)
    }
  };
}

/**
 * getMetadata fetches information about a file.
 * @params productionId ID of the production
 * @params id of the screenplay
 */
export default (async function getMetadata({
  productionId,
  id
}: GetMetadataInput): Promise<APIResponseType<GetMetadataOutput>> {
  const response = await (MOCK_API
    ? mock(GetMetadataResponseMock)
    : post(
        `${API_URL}/v1/productions/${productionId}/screenplays/get_metadata`,
        { id }
      ));

  const output: APIResponseType<GetMetadataOutput> = {
    ...response,
    data: await decoder(response.data)
  };

  return output;
});
