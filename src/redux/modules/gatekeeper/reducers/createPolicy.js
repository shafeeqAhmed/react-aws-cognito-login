// @flow
import { get } from "lodash";
import type { State } from "../";
import type {
  CreatePolicyFulfilled,
  CreatePolicyPending,
  CreatePolicyRejected
} from "src/redux/modules/gatekeeper/actions";

export function createPolicyPending(
  state: State,
  action: CreatePolicyPending
): State {
  const policies = { ...state.policies };

  policies[action.meta.id] = {
    id: action.meta.id,
    version: 0,
    ...action.meta.input
  };

  return {
    ...state,
    policies,
    isFetching: true
  };
}

export function createPolicyFulfilled(
  state: State,
  action: CreatePolicyFulfilled
): State {
  const policy = action.payload.data.policy;
  const policies = { ...state.policies };

  policies[policy.id] = policy;
  delete policies[action.meta.id];

  return {
    ...state,
    policies,
    isFetching: false
  };
}

export function createPolicyRejected(
  state: State,
  action: CreatePolicyRejected
): State {
  const policies = { ...state.policies };
  delete policies[action.meta.id];

  return {
    ...state,
    policies,
    error: get(action, "error", "There was an error. Try again"),
    isFetching: false
  };
}
