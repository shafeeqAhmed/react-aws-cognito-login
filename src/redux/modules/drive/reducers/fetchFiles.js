// @flow
import { get, findIndex } from "lodash";
import type { State } from "../";
import type { FetchFilesAction } from "src/redux/modules/drive/actions";
import { upsert } from "src/helpers/lodash";

export function fetchFilesPending(
  state: State,
  action: FetchFilesAction
): State {
  return {
    ...state,
    isFetching: true
  };
}

export function fetchFilesFulfilled(
  state: State,
  action: FetchFilesAction
): State {
  const filesFromApi = get(action, "payload.data.files");
  const isFirstLevelFetched = get(action, "meta.input.isFirstLevelFetched");
  const folderId = get(action, "meta.input.folderId");

  const files = filesFromApi.reduce(
    (list, file) => upsert(list, file, f => f.id === file.id),
    state.files.slice()
  );

  let fetchedFolders = state.moveToDialog.fetchedFolders;

  if (folderId) {
    fetchedFolders = [...state.moveToDialog.fetchedFolders];
    if (findIndex(fetchedFolders, folderId) === -1) {
      fetchedFolders.push(folderId);
    }
  }

  return {
    ...state,
    files,
    isFetching: false,
    error: undefined,
    moveToDialog: {
      ...state.moveToDialog,
      fetchedFolders,
      isFirstLevelFetched: !state.moveToDialog.isFirstLevelFetched
        ? isFirstLevelFetched
        : state.moveToDialog.isFirstLevelFetched
    }
  };
}

export function fetchFilesRejected(
  state: State,
  action: FetchFilesAction
): State {
  return {
    ...state,
    isFetching: false,
    error: get(action, "payload", "An error occurred. Try again.")
  };
}
