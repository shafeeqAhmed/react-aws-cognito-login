// @flow
import { getMetadata as fetchFileApi } from "src/redux/modules/drive/api";
import type { APIError, APIResponseType } from "src/helpers/api";
import type {
  GetMetadataInput,
  GetMetadataOutput
} from "src/redux/modules/drive/api";

export const FETCH_FILE = ("procliq-web-editor/drive/FETCH_FILE": "procliq-web-editor/drive/FETCH_FILE");
export const FETCH_FILE_PENDING = ("procliq-web-editor/drive/FETCH_FILE_PENDING": "procliq-web-editor/drive/FETCH_FILE_PENDING");
export const FETCH_FILE_FULFILLED = ("procliq-web-editor/drive/FETCH_FILE_FULFILLED": "procliq-web-editor/drive/FETCH_FILE_FULFILLED");
export const FETCH_FILE_REJECTED = ("procliq-web-editor/drive/FETCH_FILE_REJECTED": "procliq-web-editor/drive/FETCH_FILE_REJECTED");

type FetchFileMeta = {
  input: GetMetadataInput
};

export type FetchFileAction = {
  type: typeof FETCH_FILE,
  payload: Promise<APIResponseType<GetMetadataOutput>>,
  meta: FetchFileMeta
};

export type FetchFileActionPending = {
  type: typeof FETCH_FILE_PENDING,
  meta: FetchFileMeta
};

export type FetchFileActionFulfilled = {
  type: typeof FETCH_FILE_FULFILLED,
  payload: APIResponseType<GetMetadataOutput>,
  meta: FetchFileMeta
};

export type FetchFileActionRejected = {
  type: typeof FETCH_FILE_REJECTED,
  error: APIError,
  meta: FetchFileMeta
};

export const fetchFile = (productionId: number, fileId: string) => ({
  type: FETCH_FILE,
  payload: fetchFileApi({ productionId, fileId }),
  meta: {
    input: { productionId, fileId }
  }
});
