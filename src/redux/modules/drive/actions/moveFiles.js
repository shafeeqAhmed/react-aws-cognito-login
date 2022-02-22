// @flow
import { moveFiles as moveFilesApi } from "src/redux/modules/drive/api";
import type { APIError, APIResponseType } from "src/helpers/api";
import type {
  MoveFilesInput,
  MoveFilesOutput
} from "src/redux/modules/drive/api";

export const MOVE_FILES = ("procliq-web-editor/drive/MOVE_FILES": "procliq-web-editor/drive/MOVE_FILES");
export const MOVE_FILES_PENDING = ("procliq-web-editor/drive/MOVE_FILES_PENDING": "procliq-web-editor/drive/MOVE_FILES_PENDING");
export const MOVE_FILES_FULFILLED = ("procliq-web-editor/drive/MOVE_FILES_FULFILLED": "procliq-web-editor/drive/MOVE_FILES_FULFILLED");
export const MOVE_FILES_REJECTED = ("procliq-web-editor/drive/MOVE_FILES_REJECTED": "procliq-web-editor/drive/MOVE_FILES_REJECTED");

type MoveFilesMeta = {
  input: MoveFilesInput
};

export type MoveFilesAction = {
  type: typeof MOVE_FILES,
  payload: Promise<APIResponseType<MoveFilesOutput>>,
  meta: MoveFilesMeta
};

export type MoveFilesActionPending = {
  type: typeof MOVE_FILES_PENDING,
  meta: MoveFilesMeta
};

export type MoveFilesActionFulfilled = {
  type: typeof MOVE_FILES_FULFILLED,
  payload: APIResponseType<MoveFilesOutput>,
  meta: MoveFilesMeta
};

export type MoveFilesActionRejected = {
  type: typeof MOVE_FILES_REJECTED,
  error: APIError,
  meta: MoveFilesMeta
};

export const moveFiles = (
  productionId: number,
  fileIds: Array<string>,
  folderId: string
) => ({
  type: MOVE_FILES,
  payload: moveFilesApi({ productionId, fileIds, folderId }),
  meta: {
    input: { productionId, fileIds, folderId }
  }
});
