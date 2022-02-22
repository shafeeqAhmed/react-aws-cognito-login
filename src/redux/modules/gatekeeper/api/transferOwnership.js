// @flow
import { mock, post, type APIResponseType } from "src/helpers/api";
import { type Resource } from "../";
import env from "config/env";

const { MOCK_API, API_URL } = env;

type TransferOwnershipRequest = {
  production_id: string,
  resource: {
    type: "file",
    id: string
  },
  destination_user_id: string
};

type TransferOwnershipResponse = {};

const TransferOwnershipResponseMock: TransferOwnershipResponse = {};

export type TransferOwnershipInput = {
  productionId: number,
  resource: Resource,
  userId: string
};

export type TransferOwnershipOutput = {};

async function encoder(
  input: TransferOwnershipInput
): Promise<TransferOwnershipRequest> {
  return {
    production_id: `${input.productionId}`,
    resource: input.resource,
    destination_user_id: input.userId
  };
}

async function decoder(
  res: TransferOwnershipResponse
): Promise<TransferOwnershipOutput> {
  return {};
}

/**
 * transferOwnership changes the owner of a resource.
 */
export default async function transferOwnership(
  input: TransferOwnershipInput
): Promise<APIResponseType<TransferOwnershipOutput>> {
  // eslint-disable-next-line camelcase
  const { production_id, ...req } = await encoder(input);

  const response = await (MOCK_API
    ? mock(TransferOwnershipResponseMock)
    : post(
        // eslint-disable-next-line camelcase
        `${API_URL}/v1/productions/${production_id}/gatekeeper/transfer_ownership`,
        req
      ));

  const output: APIResponseType<TransferOwnershipOutput> = {
    ...response,
    data: await decoder(response.data)
  };

  return output;
}
