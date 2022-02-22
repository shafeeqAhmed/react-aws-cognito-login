// @flow
import { createSelector } from "reselect";
import type { Policy, Resource } from "src/redux/modules/gatekeeper";
import type { RootReducerState } from "src/redux/modules";

function getPolicies(state: RootReducerState): Array<Policy> {
  return ((Object.values(state.gatekeeper.policies): any): Array<Policy>);
}

function getResource(_: RootReducerState, resource: Resource): Resource {
  return resource;
}

const listPolicies = createSelector(
  [getPolicies, getResource],
  (policies: Array<Policy>, resource: Resource): Array<Policy> =>
    policies.filter(
      p =>
        p.resource.type === resource.type &&
        p.resource.id === resource.id &&
        !p.deletedAt
    )
);

export default listPolicies;
