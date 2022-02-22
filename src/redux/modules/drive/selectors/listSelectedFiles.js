// @flow
import { createSelector } from "reselect";
import { Sections } from "src/redux/modules/drive";
import type { File } from "src/redux/modules/drive";
import type { RootReducerState } from "src/redux/modules";

function getFiles(state: RootReducerState): Array<File> {
  return state.drive.files;
}

function getSelectedFileIds(state: RootReducerState): Array<string> {
  return state.drive.selection.fileIds;
}

function getFolderId(_: RootReducerState, folderId?: ?string): ?string {
  return folderId;
}

function getCurrentUserId(state: RootReducerState): ?string {
  return state.users.currentUserId;
}

const listSelectedFiles = createSelector(
  [getFiles, getSelectedFileIds, getFolderId, getCurrentUserId],
  (
    files: Array<File>,
    selectedFileIds: Array<string>,
    folderId: ?string,
    currentUserId: ?string
  ): Array<File> => {
    const selectedFiles = selectedFileIds
      .map(id => files.find(f => f.id === id))
      .filter(
        f =>
          !!f &&
          typeof f !== "undefined" &&
          // no folderId was specified
          (typeof folderId === "undefined" ||
            // from the recent folder
            folderId === Sections.RECENT ||
            // from the trash folder
            (folderId === Sections.TRASH && !!f.deletedAt) ||
            // from the favorites folder
            (folderId === Sections.FAVORITES &&
              currentUserId &&
              (f.favoritedBy || []).includes(currentUserId)) ||
            // from the root folder
            (!f.folderId && !folderId) ||
            // from any other folder
            f.folderId === folderId)
      );

    return ((selectedFiles: any): Array<File>);
  }
);

export default listSelectedFiles;
