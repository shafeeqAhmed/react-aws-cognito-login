// @flow

export const DOWNLOAD_FILE = ("procliq-web-editor/drive/DOWNLOAD_FILE": "procliq-web-editor/drive/DOWNLOAD_FILE");

export type DownloadFileAction = {
  type: typeof DOWNLOAD_FILE,
  payload: { fileId: string, zip?: boolean }
};

export const downloadFile = (
  fileId: string,
  zip?: boolean
): DownloadFileAction => ({
  type: DOWNLOAD_FILE,
  payload: { fileId, zip }
});
