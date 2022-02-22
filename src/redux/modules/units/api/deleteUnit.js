// @flow
import { mock, post } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import type { Unit } from "src/redux/modules/units";
import env from "config/env";

const { MOCK_API, API_URL } = env;

type DeleteUnitRequest = {
  production_id: string,
  id: string
};

type DeleteUnitResponse = {
  id: string,
  version: number
};

const DeleteUnitResponseMock: DeleteUnitResponse = {
  id: "16YnaffAV9t5NK6rddP6wbiHCAB",
  version: 1
};

export type DeleteUnitInput = {
  productionId: number,
  unitId: string
};

export type DeleteUnitOutput = {
  unit: $Shape<Unit>
};

/**
 * encodes a `DeleteUnitInput` object to an api request.
 */
async function encoder(input: DeleteUnitInput): Promise<DeleteUnitRequest> {
  return {
    production_id: `${input.productionId}`,
    id: input.unitId
  };
}

/**
 * decodes the api response to `DeleteUnitOutput`.
 */
async function decoder(res: DeleteUnitResponse): Promise<DeleteUnitOutput> {
  // eslint-disable-next-line camelcase
  return { unit: res };
}

/**
 * deleteUnit removes a unit from a production.
 */
export default async function deleteUnit(
  input: DeleteUnitInput
): Promise<APIResponseType<DeleteUnitOutput>> {
  // eslint-disable-next-line camelcase
  const { production_id, ...req } = await encoder(input);

  const response = await (MOCK_API
    ? mock(DeleteUnitResponseMock)
    : // eslint-disable-next-line camelcase
      post(
        // eslint-disable-next-line camelcase
        `${API_URL}/v1/productions/${production_id}/units/delete`,
        req
      ));

  const output: APIResponseType<DeleteUnitOutput> = {
    ...response,
    data: await decoder(response.data)
  };

  return output;
}
