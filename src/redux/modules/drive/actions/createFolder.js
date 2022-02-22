// @flow
import { createFolder as createFolderApi } from "src/redux/modules/drive/api";
import type {
  CreateFolderInput,
  CreateFolderOutput
} from "src/redux/modules/drive/api";
import type { APIError, APIResponseType } from "src/helpers/api";

export const CREATE_FOLDER = ("procliq-web-editor/drive/CREATE_FOLDER": "procliq-web-editor/drive/CREATE_FOLDER");
export const CREATE_FOLDER_PENDING = ("procliq-web-editor/drive/CREATE_FOLDER_PENDING": "procliq-web-editor/drive/CREATE_FOLDER_PENDING");
export const CREATE_FOLDER_FULFILLED = ("procliq-web-editor/drive/CREATE_FOLDER_FULFILLED": "procliq-web-editor/drive/CREATE_FOLDER_FULFILLED");
export const CREATE_FOLDER_REJECTED = ("procliq-web-editor/drive/CREATE_FOLDER_REJECTED": "procliq-web-editor/drive/CREATE_FOLDER_REJECTED");

export type CreateFolderAction = {
  type: typeof CREATE_FOLDER,
  payload: Promise<APIResponseType<CreateFolderOutput>>,
  meta: {
    input: CreateFolderInput
  }
};

export type CreateFolderActionPending = {
  type: typeof CREATE_FOLDER_PENDING,
  meta: {
    input: CreateFolderInput
  }
};

export type CreateFolderActionFulfilled = {
  type: typeof CREATE_FOLDER_FULFILLED,
  payload: APIResponseType<CreateFolderOutput>,
  meta: {
    input: CreateFolderInput
  }
};

export type CreateFolderActionRejected = {
  type: typeof CREATE_FOLDER_REJECTED,
  error: APIError,
  meta: {
    input: CreateFolderInput
  }
};

export const createFolder = (
  productionId: number,
  name: string,
  folderId?: string
): CreateFolderAction => ({
  type: CREATE_FOLDER,
  payload: createFolderApi({ productionId, name, folderId }),
  meta: { input: { productionId, name, folderId } }
});
