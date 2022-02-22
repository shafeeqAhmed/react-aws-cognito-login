// @flow
import { get, findIndex } from "lodash";
import { FileTypes } from "src/redux/modules/drive";
import type { State } from "../";
import type {
  DuplicateFileActionFulfilled,
  DuplicateFileActionPending,
  DuplicateFileActionRejected
} from "src/redux/modules/drive/actions";

export function duplicateFilePending(
  state: State,
  action: DuplicateFileActionPending
): State {
  const { id, input } = action.meta;

  // add file optimistically
  const files = state.files.slice();
  const original = files.find(f => f.id === input.fileId);

  files.push({
    id,
    version: 0,
    productionId: input.productionId,
    name: input.name,
    folderId: input.folderId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "",
    deletedAt: undefined,
    favoritedBy: [],
    filePath: "",
    fileSize: get(original, "fileSize", 0),
    fileType: get(original, "fileType", FileTypes.UPLOAD)
  });

  return {
    ...state,
    files,
    isFetching: true
  };
}

export function duplicateFileFulfilled(
  state: State,
  action: DuplicateFileActionFulfilled
): State {
  const { id } = action.meta;

  const files = state.files.slice();
  const index = findIndex(files, f => f.id === id);

  // update properties of file
  files[index] = {
    ...files[index],
    ...action.payload.data.file
  };

  return {
    ...state,
    files,
    isFetching: false
  };
}

export function duplicateFileRejected(
  state: State,
  action: DuplicateFileActionRejected
): State {
  const { id } = action.meta;

  const files = state.files.slice();
  const index = findIndex(files, f => f.id === id);

  // remove temporary file
  files.splice(index, 1);

  return {
    ...state,
    files,
    isFetching: false
  };
}
