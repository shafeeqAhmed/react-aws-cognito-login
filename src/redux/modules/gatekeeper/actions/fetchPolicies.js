// @flow
import type {
  ListPoliciesInput,
  ListPoliciesOutput
} from "src/redux/modules/gatekeeper/api";
import type { APIError, APIResponseType } from "src/helpers/api";
import { listPolicies } from "src/redux/modules/gatekeeper/api";
import type { Resource, Subject } from "src/redux/modules/gatekeeper";

export const FETCH_POLICIES = ("procliq-web-editor/gatekeeper/FETCH_POLICIES": "procliq-web-editor/gatekeeper/FETCH_POLICIES");
export const FETCH_POLICIES_PENDING = ("procliq-web-editor/gatekeeper/FETCH_POLICIES_PENDING": "procliq-web-editor/gatekeeper/FETCH_POLICIES_PENDING");
export const FETCH_POLICIES_FULFILLED = ("procliq-web-editor/gatekeeper/FETCH_POLICIES_FULFILLED": "procliq-web-editor/gatekeeper/FETCH_POLICIES_FULFILLED");
export const FETCH_POLICIES_REJECTED = ("procliq-web-editor/gatekeeper/FETCH_POLICIES_REJECTED": "procliq-web-editor/gatekeeper/FETCH_POLICIES_REJECTED");

export type FetchPolicies = {
  type: typeof FETCH_POLICIES,
  payload: Promise<APIResponseType<ListPoliciesOutput>>,
  meta: {
    input: ListPoliciesInput
  }
};

export type FetchPoliciesPending = {
  type: typeof FETCH_POLICIES_PENDING,
  meta: {
    input: ListPoliciesInput
  }
};

export type FetchPoliciesFulfilled = {
  type: typeof FETCH_POLICIES_FULFILLED,
  payload: APIResponseType<ListPoliciesOutput>,
  meta: {
    input: ListPoliciesInput
  }
};

export type FetchPoliciesRejected = {
  type: typeof FETCH_POLICIES_REJECTED,
  payload: APIError,
  meta: {
    input: ListPoliciesInput
  }
};

export const fetchPolicies = (
  productionId: number,
  resource: ?Resource,
  subject?: ?Subject,
  limit?: number,
  offset?: number
): FetchPolicies => ({
  type: FETCH_POLICIES,
  payload: listPolicies({ productionId, resource, subject, limit, offset }),
  meta: {
    input: { productionId, resource, subject, limit, offset }
  }
});
