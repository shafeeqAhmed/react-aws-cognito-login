// @flow
import { get, findIndex } from "lodash";
import type { State } from "../";
import type {
  DeleteFileActionFulfilled,
  DeleteFileActionPending,
  DeleteFileActionRejected
} from "src/redux/modules/drive/actions";

export function deleteFilePending(
  state: State,
  action: DeleteFileActionPending
): State {
  const { fileId } = action.meta.input;

  const files = state.files.slice();
  const index = findIndex(files, f => f.id === fileId);

  if (index > -1) {
    files.splice(index, 1, {
      ...files[index],
      deletedAt: new Date().toISOString()
    });
  }

  return {
    ...state,
    files,
    isFetching: true
  };
}

export function deleteFileFulfilled(
  state: State,
  action: DeleteFileActionFulfilled
): State {
  return {
    ...state,
    isFetching: false
  };
}

export function deleteFileRejected(
  state: State,
  action: DeleteFileActionRejected
): State {
  const { fileId } = action.meta.input;

  const files = state.files.slice();
  const index = findIndex(files, f => f.id === fileId);

  if (index > -1) {
    files.splice(index, 1, {
      ...files[index],
      deletedAt: undefined
    });
  }

  return {
    ...state,
    files,
    error: get(action, "error", "There was an error. Try again"),
    isFetching: false
  };
}
