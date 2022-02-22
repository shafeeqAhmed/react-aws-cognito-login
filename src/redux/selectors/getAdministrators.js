// @flow
import { createSelector } from "reselect";
import { pickBy } from "lodash";
import type { RootReducerState } from "src/redux/modules";

const getUsers = (state: RootReducerState) => state.users.users;

const getAdministrators = createSelector([getUsers], users =>
  pickBy(users, { permission: "ADMIN" })
);

export default getAdministrators;
