// @flow
import { flatMap } from "rxjs/operators";
import { get } from "lodash";
import { GET_METADATA } from "src/redux/modules/screenplay";
import { fetchFilePath } from "src/redux/modules/drive";
import type { Store } from "redux";
import type { RootReducerState } from "src/redux/modules";

/**
 * Fetch the hierarchy of files when a screenplay is open.
 */
const fetchScreenplayFiles = (
  action$: Object,
  store: Store<RootReducerState, mixed, mixed>
) =>
  action$.ofType(GET_METADATA).pipe(
    flatMap(async action => {
      const res = await action.payload;
      const productionId = get(res, "data.metadata.productionId", 0);
      const fileId = get(res, "data.metadata.fileId", "");
      if (!productionId || !fileId) return null;
      return fetchFilePath(productionId, fileId);
    })
  );

export default fetchScreenplayFiles;
