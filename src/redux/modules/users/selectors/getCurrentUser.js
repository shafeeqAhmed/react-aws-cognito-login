// @flow
import { createSelector } from "reselect";
import type { RootReducerState } from "src/redux/modules";
import type { UserProfile } from "src/redux/modules/users";

const getUsers = (state: RootReducerState) => state.users.users;
const getUserId = (state: RootReducerState) => state.users.currentUserId;

const getCurrentUser: RootReducerState => ?UserProfile = createSelector(
  [getUsers, getUserId],
  (users, currentUserId) => (currentUserId ? users[currentUserId] : null)
);

export default getCurrentUser;
