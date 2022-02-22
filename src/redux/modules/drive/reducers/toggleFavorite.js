// @flow
import { get, findIndex, uniq } from "lodash";
import type {
  ToggleFavoriteActionFulfilled,
  ToggleFavoriteActionPending,
  ToggleFavoriteActionRejected
} from "src/redux/modules/drive/actions";
import type { State } from "../";

export function toggleFavoritePending(
  state: State,
  action: ToggleFavoriteActionPending
): State {
  const input = action.meta.input;
  const userId = action.meta.extras.userId;
  const files = state.files.slice();

  const index = findIndex(files, f => f.id === input.fileId);

  if (userId && index > -1) {
    const file = files[index];
    const favoritedBy = input.favorite
      ? uniq([...(file.favoritedBy || []), userId])
      : (file.favoritedBy || []).filter(id => id !== userId);

    files.splice(index, 1, {
      ...file,
      favoritedBy
    });
  }

  return {
    ...state,
    files,
    isFetching: true
  };
}

export function toggleFavoriteFulfilled(
  state: State,
  action: ToggleFavoriteActionFulfilled
): State {
  const file = action.payload.data.file;

  const files = state.files.slice();
  const index = findIndex(files, f => f.id === file.id);

  if (index > -1) {
    files.splice(index, 1, {
      ...files[index],
      ...file
    });
  }

  return {
    ...state,
    files,
    isFetching: false
  };
}

export function toggleFavoriteRejected(
  state: State,
  action: ToggleFavoriteActionRejected
): State {
  const input = action.meta.input;
  const userId = action.meta.extras.userId;
  const files = state.files.slice();

  const index = findIndex(files, f => f.id === input.fileId);

  if (userId && index > -1) {
    const file = files[index];
    const favoritedBy = input.favorite
      ? (file.favoritedBy || []).filter(id => id !== userId)
      : [...new Set([...(file.favoritedBy || []), userId])];

    files.splice(index, 1, {
      ...file,
      favoritedBy
    });
  }

  return {
    ...state,
    files,
    error: get(action, "error", "There was an error. Try again."),
    isFetching: true
  };
}
