// @flow
import { get, findIndex, remove } from "lodash";
import { FileTypes } from "src/redux/modules/drive/index";
import type { File, State } from "../";
import type {
  CreateFolderActionFulfilled,
  CreateFolderActionPending,
  CreateFolderActionRejected
} from "src/redux/modules/drive/actions/createFolder";

export function createFolderPending(
  state: State,
  action: CreateFolderActionPending
): State {
  const input = action.meta.input;

  const folder: File = {
    id: input.name,
    version: 0,
    folderId: input.folderId,
    filePath: "",
    fileType: FileTypes.FOLDER,
    fileSize: 0,
    name: input.name,
    productionId: input.productionId,
    favoritedBy: [],
    createdBy: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: undefined
  };

  const files = state.files.concat([folder]);

  return {
    ...state,
    files,
    isFetching: true
  };
}

export function createFolderFulfilled(
  state: State,
  action: CreateFolderActionFulfilled
): State {
  const input = action.meta.input;
  const file = action.payload.data.file;

  const files = state.files.slice();
  const index = findIndex(
    files,
    f =>
      f.name === input.name &&
      f.fileType === FileTypes.FOLDER &&
      f.productionId === input.productionId &&
      f.folderId === input.folderId &&
      f.version === 0
  );

  if (index > -1) {
    files.splice(index, 1, {
      ...files[index],
      ...file
    });
  } else {
    files.push({
      ...file,
      name: input.name,
      folderId: input.folderId,
      fileType: FileTypes.FOLDER,
      productionId: input.productionId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  return {
    ...state,
    files,
    isFetching: false
  };
}

export function createFolderRejected(
  state: State,
  action: CreateFolderActionRejected
): State {
  const input = action.meta.input;

  const files = state.files.slice();
  remove(
    files,
    f =>
      f.name === input.name &&
      f.fileType === FileTypes.FOLDER &&
      f.productionId === input.productionId &&
      f.folderId === input.folderId &&
      f.version === 0
  );

  return {
    ...state,
    files,
    error: get(action, "error.data", "There was an error. Try again."),
    isFetching: false
  };
}
