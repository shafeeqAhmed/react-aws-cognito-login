// @flow
import { uploadFileProgress } from "src/redux/modules/drive/actions";
import { uploadFile as uploadFileApi } from "src/redux/modules/drive/api";
import type { UploadFileOutput } from "src/redux/modules/drive/api";
import type { APIError, APIResponseType } from "src/helpers/api";

export const UPLOAD_FILE = ("procliq-web-editor/drive/UPLOAD_FILE": "procliq-web-editor/drive/UPLOAD_FILE");
export const UPLOAD_FILE_PENDING = ("procliq-web-editor/drive/UPLOAD_FILE_PENDING": "procliq-web-editor/drive/UPLOAD_FILE_PENDING");
export const UPLOAD_FILE_FULFILLED = ("procliq-web-editor/drive/UPLOAD_FILE_FULFILLED": "procliq-web-editor/drive/UPLOAD_FILE_FULFILLED");
export const UPLOAD_FILE_REJECTED = ("procliq-web-editor/drive/UPLOAD_FILE_REJECTED": "procliq-web-editor/drive/UPLOAD_FILE_REJECTED");

export type UploadFileAction = {
  type: typeof UPLOAD_FILE,
  payload: Promise<APIResponseType<UploadFileOutput>>,
  meta: {
    input: {
      productionId: number,
      blob: Blob,
      name: string,
      folderId: ?string
    }
  }
};

export type UploadFileActionPending = {
  type: typeof UPLOAD_FILE_PENDING,
  meta: {
    input: {
      productionId: number,
      blob: Blob,
      name: string,
      folderId: ?string
    }
  }
};

export type UploadFileActionFulfilled = {
  type: typeof UPLOAD_FILE_FULFILLED,
  payload: APIResponseType<UploadFileOutput>,
  meta: {
    input: {
      productionId: number,
      blob: Blob,
      name: string,
      folderId: ?string
    }
  }
};

export type UploadFileActionRejected = {
  type: typeof UPLOAD_FILE_REJECTED,
  error: APIError,
  meta: {
    input: {
      productionId: number,
      blob: Blob,
      name: string,
      folderId: ?string
    }
  }
};

export const uploadFile = (
  productionId: number,
  blob: Blob,
  name: string,
  folderId: ?string
) => (dispatch: Function) => {
  dispatch({
    type: UPLOAD_FILE,
    payload: uploadFileApi({
      productionId,
      blob,
      name,
      folderId,
      onUploadProgress: (
        pId: number,
        fileId: string,
        loaded: number,
        total: number
      ) => {
        dispatch(
          uploadFileProgress(pId, fileId, loaded, total, name, folderId)
        );
      }
    }),
    meta: {
      input: { productionId, blob, name, folderId }
    }
  });
};
