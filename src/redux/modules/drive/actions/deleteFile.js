// @flow
import { deleteFile as deleteFileApi } from "src/redux/modules/drive/api";
import type { APIError, APIResponseType } from "src/helpers/api";
import type {
  DeleteFileInput,
  DeleteFileOutput
} from "src/redux/modules/drive/api";

export const DELETE_FILE = ("procliq-web-editor/drive/DELETE_FILE": "procliq-web-editor/drive/DELETE_FILE");
export const DELETE_FILE_PENDING = ("procliq-web-editor/drive/DELETE_FILE_PENDING": "procliq-web-editor/drive/DELETE_FILE_PENDING");
export const DELETE_FILE_FULFILLED = ("procliq-web-editor/drive/DELETE_FILE_FULFILLED": "procliq-web-editor/drive/DELETE_FILE_FULFILLED");
export const DELETE_FILE_REJECTED = ("procliq-web-editor/drive/DELETE_FILE_REJECTED": "procliq-web-editor/drive/DELETE_FILE_REJECTED");

type DeleteFileMeta = {
  input: DeleteFileInput
};

export type DeleteFileAction = {
  type: typeof DELETE_FILE,
  payload: Promise<APIResponseType<DeleteFileOutput>>,
  meta: DeleteFileMeta
};

export type DeleteFileActionPending = {
  type: typeof DELETE_FILE_PENDING,
  meta: DeleteFileMeta
};

export type DeleteFileActionFulfilled = {
  type: typeof DELETE_FILE_FULFILLED,
  payload: APIResponseType<DeleteFileOutput>,
  meta: DeleteFileMeta
};

export type DeleteFileActionRejected = {
  type: typeof DELETE_FILE_REJECTED,
  error: APIError,
  meta: DeleteFileMeta
};

export const deleteFile = (productionId: number, fileId: string) => ({
  type: DELETE_FILE,
  payload: deleteFileApi({ productionId, fileId }),
  meta: {
    input: { productionId, fileId }
  }
});
