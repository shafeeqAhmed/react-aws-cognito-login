// @flow
import ksuid from "ksuid";
import { duplicateFile as duplicateFileApi } from "src/redux/modules/drive/api";
import type { APIError, APIResponseType } from "src/helpers/api";
import type {
  DuplicateFileInput,
  DuplicateFileOutput
} from "src/redux/modules/drive/api";

export const DUPLICATE_FILE = ("procliq-web-editor/drive/DUPLICATE_FILE": "procliq-web-editor/drive/DUPLICATE_FILE");
export const DUPLICATE_FILE_PENDING = ("procliq-web-editor/drive/DUPLICATE_FILE_PENDING": "procliq-web-editor/drive/DUPLICATE_FILE_PENDING");
export const DUPLICATE_FILE_FULFILLED = ("procliq-web-editor/drive/DUPLICATE_FILE_FULFILLED": "procliq-web-editor/drive/DUPLICATE_FILE_FULFILLED");
export const DUPLICATE_FILE_REJECTED = ("procliq-web-editor/drive/DUPLICATE_FILE_REJECTED": "procliq-web-editor/drive/DUPLICATE_FILE_REJECTED");

type DuplicateFileMeta = {
  id: string,
  input: DuplicateFileInput
};

export type DuplicateFileAction = {
  type: typeof DUPLICATE_FILE,
  payload: Promise<APIResponseType<DuplicateFileOutput>>,
  meta: DuplicateFileMeta
};

export type DuplicateFileActionPending = {
  type: typeof DUPLICATE_FILE_PENDING,
  meta: DuplicateFileMeta
};

export type DuplicateFileActionFulfilled = {
  type: typeof DUPLICATE_FILE_FULFILLED,
  payload: APIResponseType<DuplicateFileOutput>,
  meta: DuplicateFileMeta
};

export type DuplicateFileActionRejected = {
  type: typeof DUPLICATE_FILE_REJECTED,
  error: APIError,
  meta: DuplicateFileMeta
};

export const duplicateFile = (
  productionId: number,
  fileId: string,
  name: string,
  folderId: ?string
): DuplicateFileAction => ({
  type: DUPLICATE_FILE,
  payload: duplicateFileApi({ productionId, fileId, name, folderId }),
  meta: {
    id: ksuid.randomSync().string,
    input: { productionId, fileId, name, folderId }
  }
});
