// @flow
import { createSelector } from "reselect";
import { get } from "lodash";
import type { RootReducerState } from "src/redux/modules";
import type { ScreenplayUser } from "src/redux/modules/screenplay";
import type { UserProfile, UsersList } from "src/redux/modules/users";

function getScreenplayUsers(state: RootReducerState): Array<ScreenplayUser> {
  return get(state, "screenplay.screenplay.users", []);
}

function getCurrentUserId(state: RootReducerState): ?string {
  return state.users.currentUserId;
}

function getUsers(state: RootReducerState): UsersList {
  return get(state, "users.users", []);
}

const listScreenplayUsers = createSelector(
  [getScreenplayUsers, getCurrentUserId, getUsers],
  (
    screenplayUsers: Array<ScreenplayUser>,
    currentUserId: ?string,
    users: UsersList
  ) => {
    // filter out current user.
    const screenplayUsersExceptCurrentUser = currentUserId
      ? screenplayUsers.filter(su => su.userId !== currentUserId)
      : screenplayUsers;

    // return the merge of UserProfile and ScreenplayUser.
    const fetchedUsers = screenplayUsersExceptCurrentUser.reduce((sus, su) => {
      const userProfile = users[su.userId];

      return userProfile ? [...sus, { ...su, ...userProfile }] : sus;
    }, []);

    return (fetchedUsers: Array<ScreenplayUser & UserProfile>);
  }
);

export default listScreenplayUsers;
