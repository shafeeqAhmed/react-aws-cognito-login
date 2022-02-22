// @flow
import { get } from "lodash";
import type { State } from "../";
import type {
  ClearSearchAction,
  SearchActionFulfilled,
  SearchActionPending,
  SearchActionRejected
} from "src/redux/modules/drive/actions";
import { upsert } from "src/helpers/lodash";

export function searchPending(
  state: State,
  action: SearchActionPending
): State {
  return {
    ...state,
    search: {
      ...state.search,
      query: action.meta.input.query
    },
    isFetching: true
  };
}

export function searchFulfilled(
  state: State,
  action: SearchActionFulfilled
): State {
  const query = action.payload.data.query;
  if (query !== state.search.query) return state;

  const filesFromApi = action.payload.data.files;

  // add files from search results to state.
  const files = filesFromApi.reduce(
    (list, file) => upsert(list, file, f => f.id === file.id),
    state.files.slice()
  );

  // add to search results if the search query hasn't changed.
  const fileIds = filesFromApi.map(f => f.id);
  // const fileIds = filesFromApi.reduce(
  //   (list, file) => upsert(list, file.id, f => f.id === file.id),
  //   query === state.search.query ? state.search.fileIds.slice() : []
  // );

  return {
    ...state,
    files,
    search: {
      ...state.search,
      fileIds
    },
    isFetching: false,
    error: undefined
  };
}

export function searchRejected(
  state: State,
  action: SearchActionRejected
): State {
  return {
    ...state,
    isFetching: false,
    error: get(action, "payload", "An error occurred. Try again.")
  };
}

export function clearSearch(state: State, action: ClearSearchAction): State {
  return {
    ...state,
    search: {
      ...state.search,
      query: "",
      fileIds: []
    },
    isFetching: false
  };
}
