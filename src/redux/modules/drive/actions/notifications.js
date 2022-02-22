// @flow
import type { File } from "src/redux/modules/drive";

export const FILE_INSERTED = ("procliq-web-editor/drive/FILE_INSERTED": "procliq-web-editor/drive/FILE_INSERTED");
export const FILE_MODIFIED = ("procliq-web-editor/drive/FILE_MODIFIED": "procliq-web-editor/drive/FILE_MODIFIED");
export const FILE_REMOVED = ("procliq-web-editor/drive/FILE_REMOVED": "procliq-web-editor/drive/FILE_REMOVED");

export type FileInsertedAction = {
  type: typeof FILE_INSERTED,
  payload: File
};

export type FileModifiedAction = {
  type: typeof FILE_MODIFIED,
  payload: File
};

export type FileRemovedAction = {
  type: typeof FILE_REMOVED,
  payload: File
};
