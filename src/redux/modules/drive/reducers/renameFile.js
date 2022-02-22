// @flow
import { findIndex } from "lodash";
import type { State } from "../";
import type {
  RenameFileActionFulfilled,
  RenameFileActionPending,
  RenameFileActionRejected
} from "src/redux/modules/drive/actions";

export function renameFilePending(
  state: State,
  action: RenameFileActionPending
): State {
  const input = action.meta.input;

  const files = state.files.slice();
  const index = findIndex(files, f => f.id === input.fileId);

  if (index > -1) {
    files.splice(index, 1, {
      ...files[index],
      name: input.name
    });
  }

  return {
    ...state,
    files,
    isFetching: true
  };
}

export function renameFileFulfilled(
  state: State,
  action: RenameFileActionFulfilled
): State {
  return {
    ...state,
    isFetching: false
  };
}

export function renameFileRejected(
  state: State,
  action: RenameFileActionRejected
): State {
  // TODO: refetch file in middleware
  return state;
}
