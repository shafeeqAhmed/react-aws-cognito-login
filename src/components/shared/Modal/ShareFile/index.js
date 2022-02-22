// @flow
import { connect } from "react-redux";
import { get } from "lodash";
import Component from "./shareFile";
import {
  createPolicy,
  deletePolicy,
  transferOwnership,
  listPoliciesForResource,
  listSubjectsForResource,
  ResourceTypes,
  type Policy
} from "src/redux/modules/gatekeeper";
import { type File } from "src/redux/modules/drive";
import {
  getCurrentProduction,
  type Production
} from "src/redux/modules/productions";
import {
  search,
  listSearchResults,
  type Department,
  type UserProfile,
  type UserTag
} from "src/redux/modules/users";

type OwnProps = {
  onClose: Function,
  file: File
};

type StateProps = {
  +production: ?Production,
  +policies: Array<Policy>,
  +users: { [id: string]: UserProfile },
  +tags: { [id: string]: UserTag },
  +departments: { [id: string]: Department },
  +searchQuery: string,
  +searchResults: {
    users: Array<UserProfile>,
    departments: Array<Department>,
    tags: Array<UserTag>
  }
};

const mapStateToProps = (
  state: RootReducerState,
  props: OwnProps
): StateProps => {
  const production = getCurrentProduction(state);

  const resource = {
    type: ResourceTypes.FILE,
    id: props.file.id
  };

  const policies: Array<Policy> = listPoliciesForResource(state, resource);

  const users = {};
  const tags = {};
  const departments = {};

  policies.forEach(p => {
    const list = listSubjectsForResource(state, p.resource);
    list.users.forEach(item => (users[item.id] = item));
    list.tags.forEach(item => (tags[item.id] = item));
    list.departments.forEach(item => (departments[item.id] = item));
  });

  const searching = get(state, "users.search", {});
  const searchQuery = searching.query || "";
  const searchResults = listSearchResults(state);

  searchResults.users.forEach((u, i) => {
    if (users[u.id]) {
      searchResults.users.splice(i, 1);
    }
  });

  searchResults.tags.forEach((u, i) => {
    if (tags[u.id]) {
      searchResults.tags.splice(i, 1);
    }
  });

  searchResults.departments.forEach((u, i) => {
    if (departments[u.id]) {
      searchResults.departments.splice(i, 1);
    }
  });

  return {
    production,
    policies,
    users,
    tags,
    departments,
    searchQuery,
    searchResults
  };
};

/**
 * DispatchProps provide ways to mutate the state.
 */
type DispatchProps = {
  createPolicy: typeof createPolicy,
  deletePolicy: typeof deletePolicy,
  transferOwnership: typeof transferOwnership,
  search: typeof search
};

const mapDispatchToProps: DispatchProps = {
  createPolicy,
  deletePolicy,
  transferOwnership,
  search
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
export type Props = OwnProps & StateProps & DispatchProps;
