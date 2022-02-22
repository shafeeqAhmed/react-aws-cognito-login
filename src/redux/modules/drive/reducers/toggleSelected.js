// @flow
import { get, xor } from "lodash";
import type { State } from "../";
import type { ToggleSelectedAction } from "src/redux/modules/drive/actions";

export default function toggleSelected(
  state: State,
  action: ToggleSelectedAction
): State {
  const selectedFileIds = get(action, "payload.fileIds", []);

  return {
    ...state,
    selection: {
      fileIds: xor(state.selection.fileIds, selectedFileIds),
      lastSelectedFileId: selectedFileIds[selectedFileIds.length - 1]
    }
  };
}
