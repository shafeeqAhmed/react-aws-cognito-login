// @flow
import { get } from "lodash";
import { flatMap } from "rxjs/operators";
import { TOGGLE_SELECTED } from "src/redux/modules/drive";
import { fetchPolicies, ResourceTypes } from "src/redux/modules/gatekeeper";
import { getFile } from "src/redux/modules/drive/selectors";
import type { Store } from "redux";
import type { RootReducerState } from "src/redux/modules";

/**
 * download file once the download url is generated.
 */
const toggleSelected = (
  action$: Object,
  store: Store<RootReducerState, mixed, mixed>
) =>
  action$.ofType(TOGGLE_SELECTED).pipe(
    flatMap(action => {
      const state = store.getState();
      const files = get(action, "payload.fileIds", []).map(fid =>
        getFile(state, fid)
      );
      return files.map(f =>
        fetchPolicies(f.productionId, { type: ResourceTypes.FILE, id: f.id })
      );
    })
  );

export default toggleSelected;
