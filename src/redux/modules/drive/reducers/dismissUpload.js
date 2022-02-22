// @flow
import { get, findIndex } from "lodash";
import type { State } from "../";
import type { DismissUploadAction } from "src/redux/modules/drive/actions";

export default function dismissUpload(
  state: State,
  action: DismissUploadAction
): State {
  const { fileId } = action.meta.input;

  const uploads = state.uploads.slice();
  const index = findIndex(uploads, u => get(u, "file.id") === fileId);

  if (index > -1) {
    uploads.splice(index, 1);
  }

  return {
    ...state,
    uploads
  };
}
