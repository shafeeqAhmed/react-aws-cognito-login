// @flow
import { flatMap } from "rxjs/operators";
import {
  FILE_INSERTED,
  FILE_MODIFIED,
  fetchFile
} from "src/redux/modules/drive/actions";
import type { Store } from "redux";
import type { RootReducerState } from "src/redux/modules";

/**
 * update file state on notification.
 */
const fileNotification = (
  action$: Object,
  store: Store<RootReducerState, mixed, mixed>
) =>
  action$
    .ofType(FILE_INSERTED, FILE_MODIFIED)
    .pipe(
      flatMap(action => [
        fetchFile(action.payload.productionId, action.payload.id)
      ])
    );

export default fileNotification;
