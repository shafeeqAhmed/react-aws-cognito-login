// @flow
import type { ListFavoritesOutput } from "src/redux/modules/drive/api";
import type { APIResponseType } from "src/helpers/api";
import { listFavorites } from "src/redux/modules/drive/api";

export const FETCH_FAVORITES = ("procliq-web-editor/drive/FETCH_FAVORITES": "procliq-web-editor/drive/FETCH_FAVORITES");
export const FETCH_FAVORITES_PENDING = ("procliq-web-editor/drive/FETCH_FAVORITES_PENDING": "procliq-web-editor/drive/FETCH_FAVORITES_PENDING");
export const FETCH_FAVORITES_FULFILLED = ("procliq-web-editor/drive/FETCH_FAVORITES_FULFILLED": "procliq-web-editor/drive/FETCH_FAVORITES_FULFILLED");
export const FETCH_FAVORITES_REJECTED = ("procliq-web-editor/drive/FETCH_FAVORITES_REJECTED": "procliq-web-editor/drive/FETCH_FAVORITES_REJECTED");

export type FetchFavoritesAction = {
  type: typeof FETCH_FAVORITES,
  payload: Promise<APIResponseType<ListFavoritesOutput>>
};

export const fetchFavorites = (
  productionId: number,
  limit?: number,
  offset?: number
) => ({
  type: FETCH_FAVORITES,
  payload: listFavorites({ productionId, limit, offset })
});
