// @flow
import { get } from "lodash";
import type { State } from "../";
import type {
  MoveFilesActionFulfilled,
  MoveFilesActionPending,
  MoveFilesActionRejected
} from "src/redux/modules/drive/actions";

export function moveFilesPending(
  state: State,
  action: MoveFilesActionPending
): State {
  const input = action.meta.input;
  const folderId = input.folderId || "";

  const files = state.files
    .slice()
    .map(f => (input.fileIds.includes(f.id) ? { ...f, folderId } : f));

  return {
    ...state,
    files,
    isFetching: true
  };
}

export function moveFilesFulfilled(
  state: State,
  action: MoveFilesActionFulfilled
): State {
  // TODO: refetch files that were not moved in middlewarre
  return {
    ...state,
    isFetching: false
  };
}

export function moveFilesRejected(
  state: State,
  action: MoveFilesActionRejected
): State {
  // TODO: refetch files in middlewarre
  return {
    ...state,
    error: get(action, "error", "There was an error. Try again."),
    isFetching: false
  };
}
