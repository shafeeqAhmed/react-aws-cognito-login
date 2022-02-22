// @flow
import { ClipboardModes } from "src/redux/modules/drive";
import type {
  CopyAction,
  CutAction,
  PasteAction
} from "src/redux/modules/drive/actions";
import type { State } from "src/redux/modules/drive";

export function copy(state: State, action: CopyAction): State {
  return {
    ...state,
    clipboard: {
      mode: ClipboardModes.COPY,
      fileIds: action.payload.fileIds
    }
  };
}

export function cut(state: State, action: CutAction): State {
  return {
    ...state,
    clipboard: {
      mode: ClipboardModes.CUT,
      fileIds: action.payload.fileIds
    }
  };
}

export function paste(state: State, action: PasteAction): State {
  return {
    ...state,
    clipboard: {
      ...state.clipboard,
      fileIds:
        state.clipboard.mode === ClipboardModes.CUT
          ? []
          : state.clipboard.fileIds
    }
  };
}
