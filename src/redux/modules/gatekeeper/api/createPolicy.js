// @flow
import { mock, post, type APIResponseType } from "src/helpers/api";
import {
  Effects,
  type Policy,
  type Resource,
  type Subject,
  type Action
} from "../";
import env from "config/env";

const { MOCK_API, API_URL } = env;

type CreatePolicyRequest = {
  production_id: string,
  resource: {
    type: "file",
    id: string
  },
  subject: {
    type: "user" | "tag" | "department",
    id: string
  },
  action: string,
  effect: "allow"
};

type CreatePolicyResponse = {
  id: string,
  version: number
};

const CreatePolicyResponseMock: CreatePolicyResponse = {
  id: "1AkiwXWGH4Qhww5k6G2d2SUQsBZ",
  version: 1
};

export type CreatePolicyInput = {
  productionId: number,
  resource: Resource,
  subject: Subject,
  action: Action
};

export type CreatePolicyOutput = {
  policy: $Shape<{ ...Policy }>
};

async function encoder(input: CreatePolicyInput): Promise<CreatePolicyRequest> {
  return {
    production_id: `${input.productionId}`,
    resource: input.resource,
    subject: input.subject,
    effect: Effects.ALLOW,
    action: input.action
  };
}

async function decoder(
  res: CreatePolicyResponse,
  input: CreatePolicyInput
): Promise<CreatePolicyOutput> {
  return { policy: { ...input, ...res } };
}

/**
 * createPolicy creates a new policy.
 */
export default async function createPolicy(
  input: CreatePolicyInput
): Promise<APIResponseType<CreatePolicyOutput>> {
  // eslint-disable-next-line camelcase
  const { production_id, ...req } = await encoder(input);

  const response = await (MOCK_API
    ? mock(CreatePolicyResponseMock)
    : post(
        // eslint-disable-next-line camelcase
        `${API_URL}/v1/productions/${production_id}/gatekeeper/create_policy`,
        req
      ));

  const output: APIResponseType<CreatePolicyOutput> = {
    ...response,
    data: await decoder(response.data, input)
  };

  return output;
}
