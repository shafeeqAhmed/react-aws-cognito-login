// @flow
import type { ListRecentOutput } from "src/redux/modules/drive/api";
import type { APIResponseType } from "src/helpers/api";
import { listRecent } from "src/redux/modules/drive/api";

export const FETCH_RECENT = ("procliq-web-editor/drive/FETCH_RECENT": "procliq-web-editor/drive/FETCH_RECENT");
export const FETCH_RECENT_PENDING = ("procliq-web-editor/drive/FETCH_RECENT_PENDING": "procliq-web-editor/drive/FETCH_RECENT_PENDING");
export const FETCH_RECENT_FULFILLED = ("procliq-web-editor/drive/FETCH_RECENT_FULFILLED": "procliq-web-editor/drive/FETCH_RECENT_FULFILLED");
export const FETCH_RECENT_REJECTED = ("procliq-web-editor/drive/FETCH_RECENT_REJECTED": "procliq-web-editor/drive/FETCH_RECENT_REJECTED");

export type FetchRecentAction = {
  type: typeof FETCH_RECENT,
  payload: Promise<APIResponseType<ListRecentOutput>>
};

export const fetchRecent = (
  productionId: number,
  limit?: number,
  offset?: number
) => ({
  type: FETCH_RECENT,
  payload: listRecent({ productionId, limit, offset })
});
