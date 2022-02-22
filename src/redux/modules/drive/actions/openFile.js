// @flow

export const OPEN_FILE = ("procliq-web-editor/drive/OPEN_FILE": "procliq-web-editor/drive/OPEN_FILE");

export type OpenFileAction = {
  type: typeof OPEN_FILE,
  payload: { fileId: string, zip?: boolean }
};

export const openFile = (fileId: string): OpenFileAction => ({
  type: OPEN_FILE,
  payload: { fileId }
});
