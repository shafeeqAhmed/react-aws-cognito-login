// @flow
import { toggleFavorite as toggleFavoriteApi } from "src/redux/modules/drive/api";
import type {
  CreateScreenplayFileOutput,
  ToggleFavoriteInput,
  ToggleFavoriteOutput
} from "src/redux/modules/drive/api";
import type { APIError, APIResponseType } from "src/helpers/api";

export const TOGGLE_FAVORITE = ("procliq-web-editor/drive/TOGGLE_FAVORITE": "procliq-web-editor/drive/TOGGLE_FAVORITE");
export const TOGGLE_FAVORITE_PENDING = ("procliq-web-editor/drive/TOGGLE_FAVORITE_PENDING": "procliq-web-editor/drive/TOGGLE_FAVORITE_PENDING");
export const TOGGLE_FAVORITE_FULFILLED = ("procliq-web-editor/drive/TOGGLE_FAVORITE_FULFILLED": "procliq-web-editor/drive/TOGGLE_FAVORITE_FULFILLED");
export const TOGGLE_FAVORITE_REJECTED = ("procliq-web-editor/drive/TOGGLE_FAVORITE_REJECTED": "procliq-web-editor/drive/TOGGLE_FAVORITE_REJECTED");

type ToggleFavoriteMeta = {
  input: ToggleFavoriteInput,
  extras: {
    userId: string
  }
};

export type ToggleFavoriteAction = {
  type: typeof TOGGLE_FAVORITE,
  payload: Promise<APIResponseType<ToggleFavoriteOutput>>,
  meta: ToggleFavoriteMeta
};

export type ToggleFavoriteActionPending = {
  type: typeof TOGGLE_FAVORITE_PENDING,
  meta: ToggleFavoriteMeta
};

export type ToggleFavoriteActionFulfilled = {
  type: typeof TOGGLE_FAVORITE_FULFILLED,
  payload: APIResponseType<CreateScreenplayFileOutput>,
  meta: ToggleFavoriteMeta
};

export type ToggleFavoriteActionRejected = {
  type: typeof TOGGLE_FAVORITE_REJECTED,
  error: APIError,
  meta: ToggleFavoriteMeta
};

export const toggleFavorite = (
  productionId: number,
  fileId: string,
  favorite: boolean,
  userId: string
) => ({
  type: TOGGLE_FAVORITE,
  payload: toggleFavoriteApi({ productionId, fileId, favorite }),
  meta: {
    input: { productionId, fileId, favorite },
    extras: { userId }
  }
});
