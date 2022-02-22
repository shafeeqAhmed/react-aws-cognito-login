// @flow
import { restoreFile as restoreFileApi } from "src/redux/modules/drive/api";
import type { APIError, APIResponseType } from "src/helpers/api";
import type {
  RestoreFileInput,
  RestoreFileOutput
} from "src/redux/modules/drive/api";

export const RESTORE_FILE = ("procliq-web-editor/drive/RESTORE_FILE": "procliq-web-editor/drive/RESTORE_FILE");
export const RESTORE_FILE_PENDING = ("procliq-web-editor/drive/RESTORE_FILE_PENDING": "procliq-web-editor/drive/RESTORE_FILE_PENDING");
export const RESTORE_FILE_FULFILLED = ("procliq-web-editor/drive/RESTORE_FILE_FULFILLED": "procliq-web-editor/drive/RESTORE_FILE_FULFILLED");
export const RESTORE_FILE_REJECTED = ("procliq-web-editor/drive/RESTORE_FILE_REJECTED": "procliq-web-editor/drive/RESTORE_FILE_REJECTED");

type RestoreFileMeta = {
  input: RestoreFileInput
};

export type RestoreFileAction = {
  type: typeof RESTORE_FILE,
  payload: Promise<APIResponseType<RestoreFileOutput>>,
  meta: RestoreFileMeta
};

export type RestoreFileActionPending = {
  type: typeof RESTORE_FILE_PENDING,
  meta: RestoreFileMeta
};

export type RestoreFileActionFulfilled = {
  type: typeof RESTORE_FILE_FULFILLED,
  payload: APIResponseType<RestoreFileOutput>,
  meta: RestoreFileMeta
};

export type RestoreFileActionRejected = {
  type: typeof RESTORE_FILE_REJECTED,
  error: APIError,
  meta: RestoreFileMeta
};

export const restoreFile = (
  productionId: number,
  fileId: string
): RestoreFileAction => ({
  type: RESTORE_FILE,
  payload: restoreFileApi({ productionId, fileId }),
  meta: {
    input: { productionId, fileId }
  }
});
