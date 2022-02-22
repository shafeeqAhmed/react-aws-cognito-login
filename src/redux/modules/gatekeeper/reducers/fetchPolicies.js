// @flow
import { get } from "lodash";
import type { State } from "../";
import type {
  FetchPoliciesFulfilled,
  FetchPoliciesPending,
  FetchPoliciesRejected
} from "src/redux/modules/gatekeeper/actions";

export function fetchPoliciesPending(
  state: State,
  action: FetchPoliciesPending
): State {
  return {
    ...state,
    isFetching: true
  };
}

export function fetchPoliciesFulfilled(
  state: State,
  action: FetchPoliciesFulfilled
): State {
  const fetched = action.payload.data.policies;
  const policies = { ...state.policies };

  fetched.forEach(p => {
    policies[p.id] = p;
  });

  return {
    ...state,
    policies,
    isFetching: false
  };
}

export function fetchPoliciesRejected(
  state: State,
  action: FetchPoliciesRejected
): State {
  return {
    ...state,
    error: get(action, "error", "There was an error. Try again"),
    isFetching: false
  };
}
