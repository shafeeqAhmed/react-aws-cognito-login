// @flow
import { createSelector } from "reselect";
import type { RootReducerState } from "src/redux/modules";

const getUsers = (state: RootReducerState) => state.users.users;
const getUserId = (_: RootReducerState, userId: string) => userId;

const getUser = createSelector(
  [getUsers, getUserId],
  (users, userId) => users[userId]
);

export default getUser;
