// @flow
import { get, findIndex } from "lodash";
import type { State } from "../";
import type {
  RestoreFileActionFulfilled,
  RestoreFileActionPending,
  RestoreFileActionRejected
} from "src/redux/modules/drive/actions";

export function restoreFilePending(
  state: State,
  action: RestoreFileActionPending
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
    isFetching: true
  };
}

export function restoreFileFulfilled(
  state: State,
  action: RestoreFileActionFulfilled
): State {
  return {
    ...state,
    isFetching: false
  };
}

export function restoreFileRejected(
  state: State,
  action: RestoreFileActionRejected
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
    error: get(action, "error", "There was an error. Try again."),
    isFetching: false
  };
}
