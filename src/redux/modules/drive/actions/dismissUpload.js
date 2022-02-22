// @flow

export const DISMISS_UPLOAD = ("procliq-web-editor/drive/DISMISS_UPLOAD": "procliq-web-editor/drive/DISMISS_UPLOAD");

export type DismissUploadAction = {
  type: typeof DISMISS_UPLOAD,
  payload: { fileId: string },
  meta: {
    input: { fileId: string }
  }
};

export const dismissUpload = (fileId: string): DismissUploadAction => ({
  type: DISMISS_UPLOAD,
  payload: { fileId },
  meta: { input: { fileId } }
});
