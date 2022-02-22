// @flow
import { get } from "lodash";
import type { State } from "../";
import type {
  DeletePolicyFulfilled,
  DeletePolicyPending,
  DeletePolicyRejected
} from "src/redux/modules/gatekeeper/actions";

export function deletePolicyPending(
  state: State,
  action: DeletePolicyPending
): State {
  const policies = { ...state.policies };

  policies[action.meta.input.policyId] = {
    ...policies[action.meta.input.policyId],
    deletedAt: new Date().toISOString()
  };

  return {
    ...state,
    policies,
    isFetching: true
  };
}

export function deletePolicyFulfilled(
  state: State,
  action: DeletePolicyFulfilled
): State {
  const policy = action.payload.data.policy;
  const policies = { ...state.policies };

  policies[policy.id] = {
    ...policies[policy.id],
    ...policy
  };

  return {
    ...state,
    policies,
    isFetching: false
  };
}

export function deletePolicyRejected(
  state: State,
  action: DeletePolicyRejected
): State {
  const policies = { ...state.policies };

  policies[action.meta.input.policyId] = {
    ...policies[action.meta.input.policyId],
    deletedAt: null
  };

  return {
    ...state,
    policies,
    error: get(action, "error", "There was an error. Try again"),
    isFetching: false
  };
}
