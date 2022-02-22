// @flow
import { removeFile as removeFileApi } from "src/redux/modules/drive/api";
import type { APIError, APIResponseType } from "src/helpers/api";
import type {
  RemoveFileInput,
  RemoveFileOutput
} from "src/redux/modules/drive/api";

export const REMOVE_FILE = ("procliq-web-editor/drive/REMOVE_FILE": "procliq-web-editor/drive/REMOVE_FILE");
export const REMOVE_FILE_PENDING = ("procliq-web-editor/drive/REMOVE_FILE_PENDING": "procliq-web-editor/drive/REMOVE_FILE_PENDING");
export const REMOVE_FILE_FULFILLED = ("procliq-web-editor/drive/REMOVE_FILE_FULFILLED": "procliq-web-editor/drive/REMOVE_FILE_FULFILLED");
export const REMOVE_FILE_REJECTED = ("procliq-web-editor/drive/REMOVE_FILE_REJECTED": "procliq-web-editor/drive/REMOVE_FILE_REJECTED");

type RemoveFileMeta = {
  input: RemoveFileInput
};

export type RemoveFileAction = {
  type: typeof REMOVE_FILE,
  payload: Promise<APIResponseType<RemoveFileOutput>>,
  meta: RemoveFileMeta
};

export type RemoveFileActionPending = {
  type: typeof REMOVE_FILE_PENDING,
  meta: RemoveFileMeta
};

export type RemoveFileActionFulfilled = {
  type: typeof REMOVE_FILE_FULFILLED,
  payload: APIResponseType<RemoveFileOutput>,
  meta: RemoveFileMeta
};

export type RemoveFileActionRejected = {
  type: typeof REMOVE_FILE_REJECTED,
  error: APIError,
  meta: RemoveFileMeta
};

export const removeFile = (productionId: number, fileId: string) => ({
  type: REMOVE_FILE,
  payload: removeFileApi({ productionId, fileId }),
  meta: {
    input: { productionId, fileId }
  }
});
