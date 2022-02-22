// @flow
import { flatMap } from "rxjs/operators";
import {
  fetchPolicies,
  TRANSFER_OWNERSHIP_FULFILLED
} from "src/redux/modules/gatekeeper";
import type { Store } from "redux";
import type { RootReducerState } from "src/redux/modules";

/**
 * re-fetches policies on resources where the ownership is transferred.
 */
const ownershipTransferred = (
  action$: Object,
  store: Store<RootReducerState, mixed, mixed>
) =>
  action$
    .ofType(TRANSFER_OWNERSHIP_FULFILLED)
    .pipe(
      flatMap(action => [
        fetchPolicies(
          action.meta.input.productionId,
          action.meta.input.resource
        )
      ])
    );

export default ownershipTransferred;
