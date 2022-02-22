// @flow
import { getDownloadUrl as getDownloadUrlApi } from "src/redux/modules/drive/api";
import type { APIError, APIResponseType } from "src/helpers/api";
import type {
  GetDownloadUrlInput,
  GetDownloadUrlOutput
} from "src/redux/modules/drive/api";

export const GET_DOWNLOAD_URL = ("procliq-web-editor/drive/GET_DOWNLOAD_URL": "procliq-web-editor/drive/GET_DOWNLOAD_URL");
export const GET_DOWNLOAD_URL_PENDING = ("procliq-web-editor/drive/GET_DOWNLOAD_URL_PENDING": "procliq-web-editor/drive/GET_DOWNLOAD_URL_PENDING");
export const GET_DOWNLOAD_URL_FULFILLED = ("procliq-web-editor/drive/GET_DOWNLOAD_URL_FULFILLED": "procliq-web-editor/drive/GET_DOWNLOAD_URL_FULFILLED");
export const GET_DOWNLOAD_URL_REJECTED = ("procliq-web-editor/drive/GET_DOWNLOAD_URL_REJECTED": "procliq-web-editor/drive/GET_DOWNLOAD_URL_REJECTED");

type GetDownloadUrlMeta = {
  input: GetDownloadUrlInput,
  open?: boolean
};

export type GetDownloadUrlAction = {
  type: typeof GET_DOWNLOAD_URL,
  payload: Promise<APIResponseType<GetDownloadUrlOutput>>,
  meta: GetDownloadUrlMeta
};

export type GetDownloadUrlActionPending = {
  type: typeof GET_DOWNLOAD_URL_PENDING,
  meta: GetDownloadUrlMeta
};

export type GetDownloadUrlActionFulfilled = {
  type: typeof GET_DOWNLOAD_URL_FULFILLED,
  payload: APIResponseType<GetDownloadUrlOutput>,
  meta: GetDownloadUrlMeta
};

export type GetDownloadUrlActionRejected = {
  type: typeof GET_DOWNLOAD_URL_REJECTED,
  error: APIError,
  meta: GetDownloadUrlMeta
};

export const getDownloadUrl = (
  productionId: number,
  fileId: string,
  processId?: ?number,
  open?: boolean
): GetDownloadUrlAction => ({
  type: GET_DOWNLOAD_URL,
  payload: getDownloadUrlApi({ productionId, fileId, processId }),
  meta: {
    input: { productionId, fileId, processId },
    open
  }
});
