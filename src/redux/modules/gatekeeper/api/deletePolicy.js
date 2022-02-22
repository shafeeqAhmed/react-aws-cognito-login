// @flow
import { mock, post, type APIResponseType } from "src/helpers/api";
import { type Policy } from "../";
import env from "config/env";

const { MOCK_API, API_URL } = env;

type DeletePolicyRequest = {
  production_id: string,
  id: string
};

type DeletePolicyResponse = {
  id: string,
  version: number
};

const DeletePolicyResponseMock: DeletePolicyResponse = {
  id: "1AkiwXWGH4Qhww5k6G2d2SUQsBZ",
  version: 1
};

export type DeletePolicyInput = {
  productionId: number,
  policyId: string
};

export type DeletePolicyOutput = {
  policy: $Shape<{ ...Policy }>
};

async function encoder(input: DeletePolicyInput): Promise<DeletePolicyRequest> {
  return {
    production_id: `${input.productionId}`,
    id: input.policyId
  };
}

async function decoder(res: DeletePolicyResponse): Promise<DeletePolicyOutput> {
  return { policy: { ...res, deletedAt: new Date().toISOString() } };
}

/**
 * deletePolicy removes a policy.
 */
export default async function deletePolicy(
  input: DeletePolicyInput
): Promise<APIResponseType<DeletePolicyOutput>> {
  // eslint-disable-next-line camelcase
  const { production_id, ...req } = await encoder(input);

  const response = await (MOCK_API
    ? mock(DeletePolicyResponseMock)
    : post(
        // eslint-disable-next-line camelcase
        `${API_URL}/v1/productions/${production_id}/gatekeeper/delete_policy`,
        req
      ));

  const output: APIResponseType<DeletePolicyOutput> = {
    ...response,
    data: await decoder(response.data)
  };

  return output;
}
