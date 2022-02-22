// @flow
import { createSelector } from "reselect";
import { filter, reverse, sortBy, compose } from "lodash/fp";
import { FileTypes } from "src/redux/modules/drive";
import type { File } from "src/redux/modules/drive";
import type { RootReducerState } from "src/redux/modules";

function getFiles(state: RootReducerState): Array<File> {
  return state.drive.files;
}

const listRecentFiles = createSelector([getFiles], files =>
  compose([
    reverse,
    sortBy("createdAt"),
    filter(f => f.fileType !== FileTypes.FOLDER && !f.deletedAt)
  ])(files)
);

export default listRecentFiles;
