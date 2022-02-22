// @flow
import { findIndex } from "lodash";
import moment from "moment";
import type { State } from "../";
import type { UploadFileProgressAction } from "src/redux/modules/drive/actions";

export default function reducer(
  state: State,
  action: UploadFileProgressAction
): State {
  const {
    productionId,
    fileId,
    loaded,
    total,
    name,
    folderId
  } = action.payload;

  const uploads = state.uploads.slice();

  const index = findIndex(
    uploads,
    u =>
      (u.file.id === `${productionId}_${name}_${folderId || ""}` &&
        u.status === "pending") ||
      (u.file.id === fileId &&
        u.file.productionId === productionId &&
        u.status === "uploading")
  );

  if (index === -1) {
    uploads.push({
      file: {
        id: fileId,
        productionId,
        name,
        folderId
      },
      loaded,
      total,
      status: "uploading",
      createdAt: moment().valueOf(),
      updatedAt: moment().valueOf()
    });
  } else {
    uploads.splice(index, 1, {
      file: {
        id: fileId,
        productionId,
        name,
        folderId
      },
      loaded,
      total,
      status: "uploading",
      createdAt: uploads[index].createdAt,
      updatedAt: moment().valueOf()
    });
  }

  return {
    ...state,
    uploads
  };
}
