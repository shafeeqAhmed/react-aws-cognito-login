// @flow
import type { ListDeletedOutput } from "src/redux/modules/drive/api";
import type { APIResponseType } from "src/helpers/api";
import { listDeleted } from "src/redux/modules/drive/api";

export const FETCH_DELETED = ("procliq-web-editor/drive/FETCH_DELETED": "procliq-web-editor/drive/FETCH_DELETED");
export const FETCH_DELETED_PENDING = ("procliq-web-editor/drive/FETCH_DELETED_PENDING": "procliq-web-editor/drive/FETCH_DELETED_PENDING");
export const FETCH_DELETED_FULFILLED = ("procliq-web-editor/drive/FETCH_DELETED_FULFILLED": "procliq-web-editor/drive/FETCH_DELETED_FULFILLED");
export const FETCH_DELETED_REJECTED = ("procliq-web-editor/drive/FETCH_DELETED_REJECTED": "procliq-web-editor/drive/FETCH_DELETED_REJECTED");

export type FetchDeletedAction = {
  type: typeof FETCH_DELETED,
  payload: Promise<APIResponseType<ListDeletedOutput>>
};

export const fetchDeleted = (
  productionId: number,
  limit?: number,
  offset?: number
): FetchDeletedAction => ({
  type: FETCH_DELETED,
  payload: listDeleted({ productionId, limit, offset })
});
