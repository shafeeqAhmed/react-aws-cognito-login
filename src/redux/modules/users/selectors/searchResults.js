// @flow
import { createSelector } from "reselect";
import { get } from "lodash";
import type {
  UserProfile,
  UserTag,
  Department,
  SearchResults
} from "src/redux/modules/users";
import type { RootReducerState } from "src/redux/modules";

function getSearchResults(state: RootReducerState): SearchResults {
  return get(state, "users.search.results", {
    users: [],
    tags: [],
    departments: []
  });
}

function getUsers(state: RootReducerState): { [id: string]: UserProfile } {
  return state.users.users;
}

function getTags(state: RootReducerState): { [id: number]: UserTag } {
  return state.users.tags;
}

function getDepartments(state: RootReducerState): { [id: number]: Department } {
  return state.users.departments;
}

const listSearchResults = createSelector(
  [getSearchResults, getUsers, getTags, getDepartments],
  (
    searchResults: SearchResults,
    users: { [id: string]: UserProfile },
    tags: { [id: number]: UserTag },
    departments: { [id: number]: Department }
  ) => ({
    users: searchResults.users.map(id => users[id]),
    tags: searchResults.tags.map(id => tags[id]),
    departments: searchResults.departments.map(id => departments[id])
  })
);

export default listSearchResults;
