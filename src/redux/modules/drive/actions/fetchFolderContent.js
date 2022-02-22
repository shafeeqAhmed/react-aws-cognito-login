// @flow
import type { ListFolderOutput } from "src/redux/modules/drive/api";
import type { APIResponseType } from "src/helpers/api";
import { listFolder } from "src/redux/modules/drive/api";

export const FETCH_FOLDER_CONTENT = ("procliq-web-editor/drive/FETCH_FOLDER_CONTENT": "procliq-web-editor/drive/FETCH_FOLDER_CONTENT");
export const FETCH_FOLDER_CONTENT_PENDING = ("procliq-web-editor/drive/FETCH_FOLDER_CONTENT_PENDING": "procliq-web-editor/drive/FETCH_FOLDER_CONTENT_PENDING");
export const FETCH_FOLDER_CONTENT_FULFILLED = ("procliq-web-editor/drive/FETCH_FOLDER_CONTENT_FULFILLED": "procliq-web-editor/drive/FETCH_FOLDER_CONTENT_FULFILLED");
export const FETCH_FOLDER_CONTENT_REJECTED = ("procliq-web-editor/drive/FETCH_FOLDER_CONTENT_REJECTED": "procliq-web-editor/drive/FETCH_FOLDER_CONTENT_REJECTED");

export type ListFolderInput = {
  isFirstLevelFetched: boolean,
  folderId: ?string
};

export type FetchFolderContentAction = {
  type: typeof FETCH_FOLDER_CONTENT,
  payload: Promise<APIResponseType<ListFolderOutput>>,
  meta: {
    input: ListFolderInput
  }
};

export const fetchFolderContent = (
  productionId: number,
  folderId: ?string,
  limit?: number,
  offset: number
): FetchFolderContentAction => ({
  type: FETCH_FOLDER_CONTENT,
  payload: listFolder({ productionId, folderId, limit, offset }),
  meta: {
    input: {
      isFirstLevelFetched: !folderId,
      folderId
    }
  }
});
