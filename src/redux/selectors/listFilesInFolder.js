// @flow
import { createSelector } from "reselect";
import { filter } from "lodash";
import type { RootReducerState } from "src/redux/modules";

function getFiles(state: RootReducerState) {
  return state.drive.files;
}

// QUESTION:
//   second argument are props in reselect's documentation, should we follow that convention?
// QUESTION:
//   why pass getFiles and getFolderId instead of directly looking up the files and folderId in the main function?
function getFolderId(_: RootReducerState, folderId: ?string) {
  return folderId;
}

const listFilesInFolder = createSelector(
  [getFiles, getFolderId],
  (files, folderId) => filter(files, f => f.folderId === folderId)
);

export default listFilesInFolder;
