// @flow
import { flatMap } from "rxjs/operators";
import {
  LINK_TO_SHOOTING_EVENT,
  UNLINK_FROM_SHOOTING_EVENT,
  SYNC_ANCHORS,
  SYNC_ANCHORS_REMOVED,
  SYNC_ANCHOR_REMOVED,
  SYNC_ANCHOR_ADDED,
  UPDATE_ELEMENT,
  REMOVE_ITEM_FROM_ELEMENT,
  fetchElement
} from "src/redux/modules/elements";
import type { Store } from "redux";
import type { RootReducerState } from "src/redux/modules";

/**
 * update element state on notification.
 */
const elementLinksNotification = (
  action$: Object,
  store: Store<RootReducerState, mixed, mixed>
) =>
  action$
    .ofType(
      `${LINK_TO_SHOOTING_EVENT}_FULFILLED`,
      `${UNLINK_FROM_SHOOTING_EVENT}_FULFILLED`,
      `${SYNC_ANCHORS_REMOVED}_FULFILLED`,
      `${SYNC_ANCHOR_REMOVED}_FULFILLED`,
      `${SYNC_ANCHOR_ADDED}_FULFILLED`,
      `${SYNC_ANCHORS}_FULFILLED`,
      `${SYNC_ANCHORS_REMOVED}_REJECTED`,
      `${SYNC_ANCHOR_REMOVED}_REJECTED`,
      `${SYNC_ANCHOR_ADDED}_REJECTED`,
      `${SYNC_ANCHORS}_REJECTED`,
      `${UPDATE_ELEMENT}_REJECTED`,
      `${REMOVE_ITEM_FROM_ELEMENT}_REJECTED`
    )
    .pipe(
      flatMap(action => [
        fetchElement({
          productionId: action.meta.request.productionId,
          elementId: action.meta.request.elementId
        })
      ])
    );

export default elementLinksNotification;
