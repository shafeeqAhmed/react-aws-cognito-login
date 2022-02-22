// @flow
import { createSelector } from "reselect";
import type { RootReducerState } from "src/redux/modules";
import type { UserProfile } from "src/redux/modules/users";

const getUsers = (state: RootReducerState) => state.users.users;
const getUserId = (state: RootReducerState) => state.users.currentUserId;

const getCurrentUser = createSelector(
  [getUsers, getUserId],
  (users, currentUserId): ?UserProfile => {
    const user = currentUserId ? users[currentUserId] : null;
    return user;
  }
);

export default getCurrentUser;
