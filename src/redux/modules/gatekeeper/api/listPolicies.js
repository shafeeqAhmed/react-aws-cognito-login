// @flow
import { mock, post, camelize } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import type { Policy, Resource, Subject } from "../";
import env from "config/env";

const { MOCK_API, API_URL } = env;

type ListPoliciesRequest = {
  production_id: string,
  resource: ?{
    type: string,
    id: string
  },
  subject: ?{
    type: string,
    id: string
  },
  limit: number,
  offset: number
};

type ListPoliciesResponse = {
  policies: Array<{
    id: string,
    version: number,
    production_id: string,
    effect: string,
    subject: {
      type: string,
      id: string
    },
    resource: {
      type: string,
      id: string
    },
    action: string,
    created_by: string,
    created_at: string,
    updated_at: string,
    deleted_at: ?string
  }>,
  limit: number,
  offset: number
};

const ListPoliciesResponseMock: ListPoliciesResponse = {
  policies: [
    {
      id: "1AFwf4bFX5MINAxk3qVdxwKntKO",
      version: 1,
      production_id: "2",
      effect: "allow",
      subject: {
        type: "user",
        id: "f984f6d5-0b2f-4abb-aff0-4575f85dbf7d"
      },
      resource: {
        type: "file",
        id: "1AFwf2fhc8ESSZEEOstn9C0Y6fc"
      },
      action: "view",
      created_by: "50393f98-fe11-47e9-a237-8ecde9b02690",
      created_at: "2018-09-15T18:22:36Z",
      updated_at: "2018-09-15T18:22:36Z",
      deleted_at: null
    },
    {
      id: "1AFwf77uDB4jMaCGJfpnA34tw29",
      version: 1,
      production_id: "2",
      effect: "allow",
      subject: {
        type: "user",
        id: "7269d43e-6a01-4303-a921-8f31314f62ef"
      },
      resource: {
        type: "file",
        id: "1AFwf2fhc8ESSZEEOstn9C0Y6fc"
      },
      action: "edit",
      created_by: "50393f98-fe11-47e9-a237-8ecde9b02690",
      created_at: "2018-09-15T18:22:36Z",
      updated_at: "2018-09-15T18:22:36Z",
      deleted_at: null
    }
  ],
  limit: 10,
  offset: 0
};

export type ListPoliciesInput = {
  productionId: number,
  resource: ?Resource,
  subject: ?Subject,
  limit?: number,
  offset?: number
};

export type ListPoliciesOutput = {
  policies: Array<Policy>,
  limit: number,
  offset: number
};

async function encoder(input: ListPoliciesInput): Promise<ListPoliciesRequest> {
  return {
    production_id: `${input.productionId}`,
    resource: input.resource ? { ...input.resource } : null,
    subject: input.subject ? { ...input.subject } : null,
    limit: typeof input.limit === "undefined" ? 100 : input.limit,
    offset: typeof input.offset === "undefined" ? 0 : input.offset
  };
}

async function decoder(res: ListPoliciesResponse): Promise<ListPoliciesOutput> {
  const { policies, ...r } = res;
  const p: Array<Policy> = policies.map(e => ({
    ...camelize(e),
    productionId: parseInt(e.production_id, 10)
  }));
  return { ...r, policies: p };
}

/**
 * listPolicies returns a paginated list of policies for the given resource and/or subject.
 */
export default async function listPolicies(
  input: ListPoliciesInput
): Promise<APIResponseType<ListPoliciesOutput>> {
  // eslint-disable-next-line camelcase
  const { production_id, ...req } = await encoder(input);

  const response = await (MOCK_API
    ? mock(ListPoliciesResponseMock)
    : post(
        // eslint-disable-next-line camelcase
        `${API_URL}/v1/productions/${production_id}/gatekeeper/list_policies`,
        req
      ));

  const output: APIResponseType<ListPoliciesOutput> = {
    ...response,
    data: await decoder(response.data)
  };

  return output;
}
