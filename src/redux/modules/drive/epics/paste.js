// @flow
import { flatMap } from "rxjs/operators";
import { PASTE, ClipboardModes } from "src/redux/modules/drive";
import { duplicateFile, moveFiles } from "src/redux/modules/drive/actions";
import { getFile } from "src/redux/modules/drive/selectors";
import type { Store } from "redux";
import type { RootReducerState } from "src/redux/modules";

/**
 * paste clipboard content.
 * Moves files if they were "cut".
 * Duplicates files if they were "copied".
 */
const paste = (action$: Object, store: Store<RootReducerState, mixed, mixed>) =>
  action$.ofType(PASTE).pipe(
    flatMap(action => {
      const state = store.getState();
      const clipboard = state.drive.clipboard;

      switch (clipboard.mode) {
        case ClipboardModes.COPY:
          return clipboard.fileIds.map(fid => {
            const f = getFile(state, fid);
            return duplicateFile(
              action.payload.productionId,
              fid,
              f ? `Copy of ${f.name}` : "copy",
              action.payload.folderId
            );
          });

        case ClipboardModes.CUT:
          return [
            moveFiles(
              action.payload.productionId,
              clipboard.fileIds,
              action.payload.folderId
            )
          ];

        default:
          return [];
      }
    })
  );

export default paste;
