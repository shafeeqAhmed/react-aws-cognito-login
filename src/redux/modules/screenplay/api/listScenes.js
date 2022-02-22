// @flow
import { camelize, mock, post } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import type { Scene } from "src/redux/modules/screenplay";
import env from "config/env";

const { MOCK_API, API_URL } = env;

type ListScenesRequest = {
  production_id: string,
  screenplay_id: string,
  limit: number,
  offset: number
};

type ListScenesResponse = {
  scenes: Array<{
    id: string,
    version: number,
    production_id: string,
    screenplay_id: string,
    title: string,
    sequence: number,
    code: string,
    locked?: boolean,
    created_by: string,
    created_at: string,
    updated_at: string,
    deleted_at: ?string
  }>,
  limit: number,
  offset: number
};

const ListScenesResponseMock: ListScenesResponse = {
  scenes: [
    {
      id: "149hbj8rDsUoECdHyxBzSCScqEt",
      version: 1,
      production_id: "31",
      screenplay_id: "149hbjTTocb6jZtLJnDGQqtuWvo",
      title: "EXT. BRICK'S PATIO - DAY",
      sequence: 1,
      code: "A1",
      locked: false,
      created_by: "528255f2-e809-4ac0-9218-6e7ade778fbe",
      created_at: "2018-05-04T20:29:57Z",
      updated_at: "2018-05-04T20:29:57Z",
      deleted_at: null
    },
    {
      id: "149hbknlQulTGIcBGkJRWxNlEJr",
      version: 1,
      production_id: "31",
      screenplay_id: "149hbjTTocb6jZtLJnDGQqtuWvo",
      title: "INT. TRAILER HOME - DAY",
      sequence: 2,
      code: "2",
      locked: true,
      created_by: "528255f2-e809-4ac0-9218-6e7ade778fbe",
      created_at: "2018-05-04T20:29:57Z",
      updated_at: "2018-05-04T20:29:57Z",
      deleted_at: null
    }
  ],
  limit: 10,
  offset: 0
};

export type ListScenesInput = {
  productionId: string,
  screenplayId: string,
  limit?: number,
  offset?: number
};

export type ListScenesOutput = {
  scenes: Array<Scene>,
  limit: number,
  offset: number
};

/**
 * encodes a `ListScenesInput` object to an api request.
 */
async function encoder(input: ListScenesInput): Promise<ListScenesRequest> {
  return {
    production_id: input.productionId,
    screenplay_id: input.screenplayId,
    limit: typeof input.limit === "undefined" ? 100 : input.limit,
    offset: typeof input.offset === "undefined" ? 0 : input.offset
  };
}

/**
 * decodes the api response to `ListScenesOutput`.
 */
async function decoder(res: ListScenesResponse): Promise<ListScenesOutput> {
  const { scenes, ...r } = res;
  const scs: Array<Scene> = scenes.map(camelize);
  return { ...r, scenes: scs };
}

/**
 * listScenes lists the scenes in a screenplay.
 */
export default async function listScenes(
  input: ListScenesInput
): Promise<APIResponseType<ListScenesOutput>> {
  // eslint-disable-next-line camelcase
  const { production_id, ...req } = await encoder(input);

  const response = await (MOCK_API
    ? mock(ListScenesResponseMock)
    : // eslint-disable-next-line camelcase
      post(`${API_URL}/v1/productions/${production_id}/scenes/list`, req));

  const output: APIResponseType<ListScenesOutput> = {
    ...response,
    data: await decoder(response.data)
  };

  return output;
}
