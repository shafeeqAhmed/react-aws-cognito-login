// @flow
import { createSelector } from "reselect";
import {
  Actions,
  SubjectTypes,
  type Policy,
  type Resource
} from "src/redux/modules/gatekeeper";
import type { UsersList, UserProfile } from "src/redux/modules/users";
import type { RootReducerState } from "src/redux/modules";

function getPolicies(state: RootReducerState): Array<Policy> {
  return ((Object.values(state.gatekeeper.policies): any): Array<Policy>);
}

function getUsers(state: RootReducerState): UsersList {
  return state.users.users;
}

function getResource(_: RootReducerState, resource: Resource): Resource {
  return resource;
}

const getOwner = createSelector(
  [getPolicies, getUsers, getResource],
  (
    policies: Array<Policy>,
    users: UsersList,
    resource: Resource
  ): ?UserProfile => {
    const policy = policies.find(
      p =>
        p.resource.type === resource.type &&
        p.resource.id === resource.id &&
        p.subject.type === SubjectTypes.USER &&
        p.action === Actions.ADMIN &&
        !p.deletedAt
    );

    if (!policy) return null;
    return users[policy.subject.id];
  }
);

export default getOwner;
