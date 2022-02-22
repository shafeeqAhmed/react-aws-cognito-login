// @flow
import { createSelector } from "reselect";
import { SubjectTypes } from "src/redux/modules/gatekeeper";
import type { Policy, Resource } from "src/redux/modules/gatekeeper";
import type {
  UsersList,
  UserProfile,
  Department,
  UserTag
} from "src/redux/modules/users";
import type { RootReducerState } from "src/redux/modules";

export type SubjectsList = {
  users: Array<UserProfile>,
  tags: Array<UserTag>,
  departments: Array<Department>
};

function getPolicies(state: RootReducerState): Array<Policy> {
  return ((Object.values(state.gatekeeper.policies): any): Array<Policy>);
}

function getUsers(state: RootReducerState): UsersList {
  return state.users.users;
}

function getTags(state: RootReducerState): { [id: number]: UserTag } {
  return state.users.tags;
}

function getDepartments(state: RootReducerState): { [id: number]: Department } {
  return state.users.departments;
}

function getResource(_: RootReducerState, resource: Resource): Resource {
  return resource;
}

const listSubjects = createSelector(
  [getPolicies, getUsers, getTags, getDepartments, getResource],
  (
    policies: Array<Policy>,
    users: UsersList,
    tags: { [id: number]: UserTag },
    departments: { [id: number]: Department },
    resource: Resource
  ): SubjectsList =>
    policies
      .filter(
        p =>
          p.resource.type === resource.type &&
          p.resource.id === resource.id &&
          !p.deletedAt
      )
      .reduce(
        (list: SubjectsList, p: Policy) => {
          switch (p.subject.type) {
            case SubjectTypes.USER:
              if (!list.users.find(u => u && u.id === p.subject.id)) {
                list.users.push(users[p.subject.id]);
              }
              break;

            case SubjectTypes.DEPARTMENT:
              if (
                !list.departments.find(d => d && `${d.id}` === p.subject.id)
              ) {
                list.departments.push(departments[parseInt(p.subject.id, 10)]);
              }
              break;

            case SubjectTypes.TAG:
              if (!list.tags.find(t => t && `${t.id}` === p.subject.id)) {
                list.tags.push(tags[parseInt(p.subject.id, 10)]);
              }
              break;

            default:
              break;
          }

          return list;
        },
        { users: [], tags: [], departments: [] }
      )
);

export default listSubjects;
