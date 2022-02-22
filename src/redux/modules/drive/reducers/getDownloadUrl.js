// @flow
import { findIndex, get } from "lodash";
import type { State } from "../";
import type {
  GetDownloadUrlActionFulfilled,
  GetDownloadUrlActionPending,
  GetDownloadUrlActionRejected
} from "src/redux/modules/drive/actions";

export function getDownloadUrlPending(
  state: State,
  action: GetDownloadUrlActionPending
): State {
  return {
    ...state,
    isFetching: true
  };
}

export function getDownloadUrlFulfilled(
  state: State,
  action: GetDownloadUrlActionFulfilled
): State {
  const files = state.files.slice();

  const index = findIndex(files, f => f.id === action.meta.input.fileId);
  if (index < 0) return state;

  files.splice(index, 1, {
    ...files[index],
    download: action.payload.data.download
  });

  return {
    ...state,
    files,
    isFetching: false
  };
}

export function getDownloadUrlRejected(
  state: State,
  action: GetDownloadUrlActionRejected
): State {
  return {
    ...state,
    error: get(action, "error", "There was an error. Try again"),
    isFetching: false
  };
}
