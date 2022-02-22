// @flow
import { createSelector } from "reselect";
import { setWith } from "lodash";
import { FileTypes, type File } from "src/redux/modules/drive";
import type { RootReducerState } from "src/redux/modules";

function getFiles(state: RootReducerState): Array<File> {
  return state.drive.files;
}

function getProductionId(state: RootReducerState): ?number {
  return (
    state.drive.moveToDialog.productionToMove ||
    state.productions.activeProductionID
  );
}

export type Folder = File & {
  +subFolders?: Folder
};

export type FolderTree = {
  [userId: string]: Folder
};

const listFolders = createSelector(
  [getFiles, getProductionId],
  (files, productionId): FolderTree => {
    const folders = {};

    const folderFiles = files.filter(
      f =>
        f.fileType === FileTypes.FOLDER &&
        `${f.productionId}` === `${productionId || ""}` &&
        !f.deletedAt
    );

    folderFiles.forEach(file => {
      const path = file.filePath.substring(1).split("/");

      let finalPath = "";

      if (path.length > 1) {
        for (let i = 0; i < path.length - 1; i++) {
          finalPath += `${path[i]}.subFolders.`;
        }
        finalPath += `${path[path.length - 1]}`;
        setWith(folders, finalPath, file);
      } else {
        folders[file.id] = file;
      }
    });
    return folders;
  }
);

export default listFolders;
