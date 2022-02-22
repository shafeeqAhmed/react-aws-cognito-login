// @flow
import type { SearchInput, SearchOutput } from "src/redux/modules/drive/api";
import type { APIError, APIResponseType } from "src/helpers/api";
import { search as searchApi } from "src/redux/modules/drive/api";
import type { FileType } from "../";

export const SEARCH = ("procliq-web-editor/drive/SEARCH": "procliq-web-editor/drive/SEARCH");
export const SEARCH_PENDING = ("procliq-web-editor/drive/SEARCH_PENDING": "procliq-web-editor/drive/SEARCH_PENDING");
export const SEARCH_FULFILLED = ("procliq-web-editor/drive/SEARCH_FULFILLED": "procliq-web-editor/drive/SEARCH_FULFILLED");
export const SEARCH_REJECTED = ("procliq-web-editor/drive/SEARCH_REJECTED": "procliq-web-editor/drive/SEARCH_REJECTED");
export const CLEAR_SEARCH = ("procliq-web-editor/drive/CLEAR_SEARCH": "procliq-web-editor/drive/CLEAR_SEARCH");

export type SearchActionPending = {
  type: typeof SEARCH_PENDING,
  meta: {
    input: SearchInput
  }
};

export type SearchActionFulfilled = {
  type: typeof SEARCH_FULFILLED,
  payload: APIResponseType<SearchOutput>,
  meta: {
    input: SearchInput
  }
};

export type SearchActionRejected = {
  type: typeof SEARCH_REJECTED,
  error: APIError,
  meta: {
    input: SearchInput
  }
};

export type SearchAction = {
  type: typeof SEARCH,
  payload: Promise<APIResponseType<SearchOutput>>,
  meta: {
    input: SearchInput
  }
};

export type ClearSearchAction = {
  type: typeof CLEAR_SEARCH
};

export const search = (
  productionId: number,
  query: string,
  fileType?: ?FileType,
  limit?: number,
  offset?: number
): SearchAction => ({
  type: SEARCH,
  payload: searchApi({ productionId, query, fileType, limit, offset }),
  meta: {
    input: { productionId, query, fileType, limit, offset }
  }
});

export const clearSearch = (): ClearSearchAction => ({
  type: CLEAR_SEARCH
});
