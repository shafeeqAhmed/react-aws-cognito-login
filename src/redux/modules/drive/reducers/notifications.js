// @flow
import type { FileRemovedAction } from "src/redux/modules/drive/actions";
import type { State } from "../";

export default function fileRemoved(
  state: State,
  action: FileRemovedAction
): State {
  const file = action.payload;
  const files = state.files.slice().filter(f => f.id !== file.id);

  return {
    ...state,
    files
  };
}
