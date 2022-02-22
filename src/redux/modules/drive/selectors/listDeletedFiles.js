// @flow
import { createSelector } from "reselect";
import { filter, reverse, sortBy } from "lodash";
import type { File } from "src/redux/modules/drive";
import type { RootReducerState } from "src/redux/modules";

function getFiles(state: RootReducerState): Array<File> {
  return state.drive.files;
}

const listDeletedFiles = createSelector([getFiles], (files: Array<File>) =>
  reverse(sortBy(filter(files, f => !!f.deletedAt), "deletedAt"))
);

export default listDeletedFiles;
