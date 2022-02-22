// @flow
import { mock, post } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import type { Unit } from "src/redux/modules/units";
import env from "config/env";

const { MOCK_API, API_URL } = env;

type CreateUnitRequest = {
  production_id: string,
  name: string
};

type CreateUnitResponse = {
  id: string,
  version: number
};

const CreateUnitResponseMock: CreateUnitResponse = {
  id: "16YnaffAV9t5NK6rddP6wbiHCAB",
  version: 1
};

export type CreateUnitInput = {
  productionId: number,
  name: string
};

export type CreateUnitOutput = {
  unit: $Shape<Unit>
};

/**
 * encodes a `CreateUnitInput` object to an api request.
 */
async function encoder(input: CreateUnitInput): Promise<CreateUnitRequest> {
  return {
    production_id: `${input.productionId}`,
    name: input.name
  };
}

/**
 * decodes the api response to `CreateUnitOutput`.
 */
async function decoder(
  res: CreateUnitResponse,
  req: CreateUnitRequest
): Promise<CreateUnitOutput> {
  // eslint-disable-next-line camelcase
  return { unit: { ...res, name: req.name } };
}

/**
 * createUnit removes a unit from a production.
 */
export default async function createUnit(
  input: CreateUnitInput
): Promise<APIResponseType<CreateUnitOutput>> {
  const request = await encoder(input);
  // eslint-disable-next-line camelcase
  const { production_id, ...requestBody } = request;

  const response = await (MOCK_API
    ? mock(CreateUnitResponseMock)
    : // eslint-disable-next-line camelcase
      post(
        // eslint-disable-next-line camelcase
        `${API_URL}/v1/productions/${production_id}/units/create`,
        requestBody
      ));

  const output: APIResponseType<CreateUnitOutput> = {
    ...response,
    body: response.data,
    data: await decoder(response.data, request)
  };

  return output;
}
