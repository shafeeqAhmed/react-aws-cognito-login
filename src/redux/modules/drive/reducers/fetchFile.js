// @flow
import { get } from "lodash";
import { upsert } from "src/helpers/lodash";
import type { State } from "../";
import type {
  FetchFileActionFulfilled,
  FetchFileActionRejected
} from "src/redux/modules/drive/actions";

export function fetchFilePending(state: State): State {
  return {
    ...state,
    isFetching: true
  };
}

export function fetchFileFulfilled(
  state: State,
  action: FetchFileActionFulfilled
): State {
  const files = state.files.slice();
  const file = action.payload.data.file;
  upsert(files, file, f => f.id === file.id);

  return {
    ...state,
    files,
    isFetching: false
  };
}

export function fetchFileRejected(
  state: State,
  action: FetchFileActionRejected
): State {
  return {
    ...state,
    error: get(action, "error", "There was an error. Try again"),
    isFetching: false
  };
}
