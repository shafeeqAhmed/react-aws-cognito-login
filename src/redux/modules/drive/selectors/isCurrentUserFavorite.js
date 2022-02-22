// @flow
import { createSelector } from "reselect";
import { get } from "lodash";
import type { RootReducerState } from "src/redux/modules";

const getFiles = (state: RootReducerState) => state.drive.files;
const getUserId = (state: RootReducerState) =>
  get(state, "users.currentUserId");
const getScreenplayId = (_, id: ?string) => id;

const isCurrentUserFavorite = createSelector(
  [getFiles, getUserId, getScreenplayId],
  (files, userId, screenplayId) =>
    files.findIndex(
      file =>
        file.screenplayId === screenplayId &&
        file.favoritedBy &&
        file.favoritedBy.includes(userId)
    ) !== -1
);

export default isCurrentUserFavorite;
