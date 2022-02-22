// @flow
import type { APIError, APIResponseType } from "src/helpers/api";
import {
  deletePolicy as deletePolicyApi,
  type DeletePolicyInput,
  type DeletePolicyOutput
} from "src/redux/modules/gatekeeper/api";

export const DELETE_POLICY = ("procliq-web-editor/gatekeeper/DELETE_POLICY": "procliq-web-editor/gatekeeper/DELETE_POLICY");
export const DELETE_POLICY_PENDING = ("procliq-web-editor/gatekeeper/DELETE_POLICY_PENDING": "procliq-web-editor/gatekeeper/DELETE_POLICY_PENDING");
export const DELETE_POLICY_FULFILLED = ("procliq-web-editor/gatekeeper/DELETE_POLICY_FULFILLED": "procliq-web-editor/gatekeeper/DELETE_POLICY_FULFILLED");
export const DELETE_POLICY_REJECTED = ("procliq-web-editor/gatekeeper/DELETE_POLICY_REJECTED": "procliq-web-editor/gatekeeper/DELETE_POLICY_REJECTED");

export type DeletePolicy = {
  type: typeof DELETE_POLICY,
  payload: Promise<APIResponseType<DeletePolicyOutput>>,
  meta: {
    input: DeletePolicyInput
  }
};

export type DeletePolicyPending = {
  type: typeof DELETE_POLICY_PENDING,
  meta: {
    input: DeletePolicyInput
  }
};

export type DeletePolicyFulfilled = {
  type: typeof DELETE_POLICY_FULFILLED,
  payload: APIResponseType<DeletePolicyOutput>,
  meta: {
    input: DeletePolicyInput
  }
};

export type DeletePolicyRejected = {
  type: typeof DELETE_POLICY_REJECTED,
  payload: APIError,
  meta: {
    input: DeletePolicyInput
  }
};

export const deletePolicy = (
  productionId: number,
  policyId: string
): DeletePolicy => ({
  type: DELETE_POLICY,
  payload: deletePolicyApi({ productionId, policyId }),
  meta: {
    input: { productionId, policyId }
  }
});
