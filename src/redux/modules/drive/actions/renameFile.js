// @flow
import { renameFile as renameFileApi } from "src/redux/modules/drive/api";
import type { APIError, APIResponseType } from "src/helpers/api";
import type {
  RenameFileInput,
  RenameFileOutput
} from "src/redux/modules/drive/api";

export const RENAME_FILE = ("procliq-web-editor/drive/RENAME_FILE": "procliq-web-editor/drive/RENAME_FILE");
export const RENAME_FILE_PENDING = ("procliq-web-editor/drive/RENAME_FILE_PENDING": "procliq-web-editor/drive/RENAME_FILE_PENDING");
export const RENAME_FILE_FULFILLED = ("procliq-web-editor/drive/RENAME_FILE_FULFILLED": "procliq-web-editor/drive/RENAME_FILE_FULFILLED");
export const RENAME_FILE_REJECTED = ("procliq-web-editor/drive/RENAME_FILE_REJECTED": "procliq-web-editor/drive/RENAME_FILE_REJECTED");

type RenameFileMeta = {
  input: RenameFileInput
};

export type RenameFileAction = {
  type: typeof RENAME_FILE,
  payload: Promise<APIResponseType<RenameFileOutput>>,
  meta: RenameFileMeta
};

export type RenameFileActionPending = {
  type: typeof RENAME_FILE_PENDING,
  meta: RenameFileMeta
};

export type RenameFileActionFulfilled = {
  type: typeof RENAME_FILE_FULFILLED,
  payload: APIResponseType<RenameFileOutput>,
  meta: RenameFileMeta
};

export type RenameFileActionRejected = {
  type: typeof RENAME_FILE_REJECTED,
  error: APIError,
  meta: RenameFileMeta
};

export const renameFile = (
  productionId: number,
  fileId: string,
  name: string
): RenameFileAction => ({
  type: RENAME_FILE,
  payload: renameFileApi({ productionId, fileId, name }),
  meta: {
    input: { productionId, fileId, name }
  }
});
