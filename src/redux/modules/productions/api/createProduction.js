// @flow
import { mock, post, type APIResponseType } from "src/helpers/api";
import env from "config/env";
import { type Production } from "../";

const { MOCK_WALKIE_API, WALKIE_API_URL } = env;

type CreateProductionRequest = {
  name: string,
  year: number,
  number: string,
  productionTypeId: number
};

type CreateProductionResponse = {
  id: number
};

const CreateProductionResponseMock: CreateProductionResponse = {
  id: 2
};

export type CreateProductionInput = {
  teamId: number,
  name: string,
  year: number,
  number: string,
  productionTypeId: number
};

export type CreateProductionOutput = {
  production: Production
};

async function encoder(
  input: CreateProductionInput
): Promise<CreateProductionRequest> {
  const { teamId, ...req } = input;
  return req;
}

async function decoder(
  res: CreateProductionResponse,
  input: CreateProductionInput
): Promise<CreateProductionOutput> {
  return { production: { ...res, ...input } };
}

export default async function createProduction(
  input: CreateProductionInput
): Promise<APIResponseType<CreateProductionOutput>> {
  // eslint-disable-next-line camelcase
  const req = await encoder(input);

  const response = await (MOCK_WALKIE_API
    ? mock(CreateProductionResponseMock)
    : post(
        `${WALKIE_API_URL}/directory/teams/${input.teamId}/productions`,
        req
      ));

  const output: APIResponseType<CreateProductionOutput> = {
    ...response,
    data: await decoder(response.data, input)
  };

  return output;
}
