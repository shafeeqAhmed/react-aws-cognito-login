// @flow
import { flatMap } from "rxjs/operators";
import {
  ELEMENT_INSERTED,
  ELEMENT_MODIFIED,
  fetchElement
} from "src/redux/modules/elements";
import type { Store } from "redux";
import type { RootReducerState } from "src/redux/modules";

/**
 * update element state on notification.
 */
const elementNotification = (
  action$: Object,
  store: Store<RootReducerState, mixed, mixed>
) =>
  action$.ofType(ELEMENT_INSERTED, ELEMENT_MODIFIED).pipe(
    flatMap(action => [
      fetchElement({
        productionId: action.payload.productionId,
        elementId: action.payload.id
      })
    ])
  );

export default elementNotification;
