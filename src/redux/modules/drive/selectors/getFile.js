// @flow
import { createSelector } from "reselect";
import { find, get } from "lodash";
import { getCurrentProduction } from "src/redux/modules/productions/selectors";
import { FileTypes } from "src/redux/modules/drive";
import type { File } from "src/redux/modules/drive";
import type { Production } from "src/redux/modules/productions";
import type { RootReducerState } from "src/redux/modules";

function getFiles(state: RootReducerState): Array<File> {
  return state.drive.files;
}

function getFileId(_: RootReducerState, fileId: ?string): ?string {
  return fileId;
}

function getProduction(state: RootReducerState): ?Production {
  return getCurrentProduction(state);
}

const getFile = createSelector(
  [getFiles, getFileId, getProduction],
  (files: Array<File>, fileId: ?string, production: ?Production) => {
    if (fileId) return find(files, f => f.id === fileId);

    return {
      id: "",
      version: 0,
      name: get(production, "name", ""),
      productionId: get(production, "id"),
      folderId: undefined,
      filePath: "",
      fileType: FileTypes.FOLDER,
      fileSize: 0,
      createdBy: undefined,
      favoritedBy: [],
      createdAt: get(production, "createdAt"),
      updatedAt: get(production, "updatedAt"),
      deletedAt: get(production, "deletedAt")
    };
  }
);

export default getFile;
