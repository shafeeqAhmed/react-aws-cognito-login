// @flow
import { createSelector } from "reselect";
import { filter } from "lodash";
import type { File } from "src/redux/modules/drive";
import type { RootReducerState } from "src/redux/modules";

function getFiles(state: RootReducerState): Array<File> {
  return state.drive.files;
}

function getFolderId(_: RootReducerState, folderId: ?string): ?string {
  return folderId;
}

const listFolderContent = createSelector(
  [getFiles, getFolderId],
  (files: Array<File>, folderId: ?string) =>
    filter(
      files,
      f => !f.deletedAt && (folderId ? f.folderId === folderId : !f.folderId)
    )
);

export default listFolderContent;
