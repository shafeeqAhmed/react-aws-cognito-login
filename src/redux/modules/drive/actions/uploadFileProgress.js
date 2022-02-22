// @flow

// Action type
export const UPLOAD_FILE_PROGRESS = ("procliq-web-editor/drive/UPLOAD_FILE_PROGRESS": "procliq-web-editor/drive/UPLOAD_FILE_PROGRESS");

// Action
export type UploadFileProgressAction = {
  type: typeof UPLOAD_FILE_PROGRESS,
  payload: {
    productionId: number,
    fileId: string,
    loaded: number,
    total: number,
    name: string,
    folderId: ?string
  }
};

// Action creator
export const uploadFileProgress = (
  productionId: number,
  fileId: string,
  loaded: number,
  total: number,
  name: string,
  folderId: ?string
): UploadFileProgressAction => ({
  type: UPLOAD_FILE_PROGRESS,
  payload: { productionId, fileId, loaded, total, name, folderId }
});
