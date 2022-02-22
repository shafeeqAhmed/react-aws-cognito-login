// @flow
import { get, findIndex, remove } from "lodash";
import type { File, State } from "../";
import type {
  CreateScreenplayActionFulfilled,
  CreateScreenplayActionPending,
  CreateScreenplayActionRejected
} from "src/redux/modules/drive/actions";
import { FileTypes } from "src/redux/modules/drive/index";

export function createScreenplayPending(
  state: State,
  action: CreateScreenplayActionPending
): State {
  const input = action.meta.input;

  const file: File = {
    id: input.name,
    version: 0,
    folderId: input.folderId,
    filePath: "",
    fileType: FileTypes.SCREENPLAY,
    fileSize: 0,
    name: input.name,
    productionId: input.productionId,
    favoritedBy: [],
    createdBy: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: undefined
  };

  const files = state.files.concat([file]);

  return {
    ...state,
    files,
    isFetching: true
  };
}

export function createScreenplayFulfilled(
  state: State,
  action: CreateScreenplayActionFulfilled
): State {
  const input = action.meta.input;
  const file = action.payload.data.file;

  const files = state.files.slice();
  const index = findIndex(
    files,
    f =>
      f.name === input.name &&
      f.fileType === FileTypes.SCREENPLAY &&
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
      fileType: FileTypes.SCREENPLAY,
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

export function createScreenplayRejected(
  state: State,
  action: CreateScreenplayActionRejected
): State {
  const input = action.meta.input;

  const files = state.files.slice();
  remove(
    files,
    f =>
      f.name === input.name &&
      f.fileType === FileTypes.SCREENPLAY &&
      f.productionId === input.productionId &&
      f.folderId === input.folderId &&
      f.version === 0
  );

  return {
    ...state,
    files,
    error: get(action, "error", "There was an error. Try again."),
    isFetching: false
  };
}
