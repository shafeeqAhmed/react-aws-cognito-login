// @flow
import { get } from "lodash";
import { flatMap } from "rxjs/operators";
import {
  FETCH_FOLDER_CONTENT_FULFILLED,
  FETCH_FAVORITES_FULFILLED,
  FETCH_RECENT_FULFILLED,
  FETCH_DELETED_FULFILLED,
  FETCH_FILE_PATH_FULFILLED,
  FETCH_FILE_PENDING
} from "src/redux/modules/drive";
import { fetchPolicies, ResourceTypes } from "src/redux/modules/gatekeeper";
import type { Store } from "redux";
import type { RootReducerState } from "src/redux/modules";

/**
 * fetch file policies when the files are fetched from API.
 */
const fetchFilePolicies = (
  action$: Object,
  store: Store<RootReducerState, mixed, mixed>
) =>
  action$
    .ofType(
      FETCH_FOLDER_CONTENT_FULFILLED,
      FETCH_FAVORITES_FULFILLED,
      FETCH_RECENT_FULFILLED,
      FETCH_DELETED_FULFILLED,
      FETCH_FILE_PATH_FULFILLED,
      FETCH_FILE_PENDING
    )
    .pipe(
      flatMap(action => {
        let files = get(action, "payload.data.files", []);
        if (!files.length) {
          const input = get(action, "meta.input");
          if (input) {
            files = [{ productionId: input.productionId, id: input.fileId }];
          }
        }

        return files.map(f =>
          fetchPolicies(f.productionId, { type: ResourceTypes.FILE, id: f.id })
        );
      })
    );

export default fetchFilePolicies;
