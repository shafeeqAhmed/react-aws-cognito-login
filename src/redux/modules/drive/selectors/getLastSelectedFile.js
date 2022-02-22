// @flow
import { createSelector } from "reselect";
import type { File } from "src/redux/modules/drive";
import type { RootReducerState } from "src/redux/modules";

function getFiles(state: RootReducerState): Array<File> {
  return state.drive.files;
}

function getlastSelectedFileId(state: RootReducerState): ?string {
  return state.drive.selection.lastSelectedFileId;
}

const getLastSelectedFile = createSelector(
  [getFiles, getlastSelectedFileId],
  (files: Array<File>, lastSelectedFileId: ?string) =>
    lastSelectedFileId ? files.find(f => f.id === lastSelectedFileId) : null
);

export default getLastSelectedFile;
