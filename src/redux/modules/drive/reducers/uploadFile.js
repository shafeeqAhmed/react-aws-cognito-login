// @flow
import type { State } from "../";
import moment from "moment";
import { findIndex } from "lodash";
import type {
  UploadFileActionFulfilled,
  UploadFileActionPending,
  UploadFileActionRejected
} from "src/redux/modules/drive/actions";

export function uploadFilePending(
  state: State,
  action: UploadFileActionPending
): State {
  const { productionId, name, folderId, blob } = action.meta.input;

  return {
    ...state,
    uploads: [
      ...state.uploads,
      {
        file: {
          id: `${productionId}_${name}_${folderId || ""}`,
          productionId,
          folderId,
          name
        },
        status: "pending",
        createdAt: moment().valueOf(),
        updatedAt: moment().valueOf(),
        loaded: 0,
        total: blob.size
      }
    ]
  };
}

export function uploadFileFulfilled(
  state: State,
  action: UploadFileActionFulfilled
): State {
  const { file } = action.payload.data;

  const files = state.files.slice();
  files.push(file);

  const uploads = state.uploads.slice();
  const index = findIndex(
    uploads,
    u =>
      (u.file.id ===
        `${file.productionId}_${file.name}_${file.folderId || ""}` &&
        u.status === "pending") ||
      (u.file.id === file.id && u.file.productionId === file.productionId)
  );

  if (index > -1) {
    uploads.splice(index, 1, {
      ...uploads[index],
      file,
      status: "success",
      updatedAt: moment().valueOf(),
      loaded: uploads[index].total
    });
  }

  return {
    ...state,
    files,
    uploads
  };
}

export function uploadFileRejected(
  state: State,
  action: UploadFileActionRejected
): State {
  const { productionId, name, folderId } = action.meta.input;

  const uploads = state.uploads.slice();
  const index = findIndex(
    uploads,
    u =>
      (u.file.id === `${productionId}_${name}_${folderId || ""}` &&
        u.status === "pending") ||
      // TODO: make the fileId accessible in the reject action
      (u.file.name === name &&
        u.file.productionId === productionId &&
        u.file.folderId === folderId &&
        u.status !== "success")
  );

  if (index > -1) {
    uploads.splice(index, 1, {
      ...uploads[index],
      status: "error",
      updatedAt: moment().valueOf()
    });
  }

  return {
    ...state,
    uploads
  };
}
