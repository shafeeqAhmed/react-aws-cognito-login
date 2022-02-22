// @flow
import { createSelector } from "reselect";
import { filter } from "lodash";
import type { File } from "src/redux/modules/drive";
import type { RootReducerState } from "src/redux/modules";

function getFiles(state: RootReducerState): Array<File> {
  return state.drive.files;
}

function getSearchedFileIds(state: RootReducerState): Array<string> {
  return state.drive.search.fileIds;
}

const listSearchedFiles = createSelector(
  [getFiles, getSearchedFileIds],
  (files: Array<File>, searchedFileIds: Array<string>) =>
    filter(
      files,
      f =>
        // file is in the selected list
        searchedFileIds.includes(f.id) &&
        // file is not in the trash
        !f.deletedAt
    )
);

export default listSearchedFiles;
