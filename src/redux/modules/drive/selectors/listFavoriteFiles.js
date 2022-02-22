// @flow
import { createSelector } from "reselect";
import { filter } from "lodash";
import type { File } from "src/redux/modules/drive";
import type { RootReducerState } from "src/redux/modules";

function getFiles(state: RootReducerState): Array<File> {
  return state.drive.files;
}

function getCurrentUserId(state: RootReducerState): ?string {
  return state.users.currentUserId;
}

const listFavoriteFiles = createSelector(
  [getFiles, getCurrentUserId],
  (files, userId) => filter(files, f => (f.favoritedBy || []).includes(userId))
);

export default listFavoriteFiles;
