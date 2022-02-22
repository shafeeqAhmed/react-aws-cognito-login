// @flow
import { get } from "lodash";
import { flatMap } from "rxjs/operators";
import { GET_DOWNLOAD_URL_FULFILLED } from "src/redux/modules/drive";
import { downloadFile, openFile } from "src/redux/modules/drive/actions";
import type { Store } from "redux";
import type { RootReducerState } from "src/redux/modules";

/**
 * download file once the download url is generated.
 */
const download = (
  action$: Object,
  store: Store<RootReducerState, mixed, mixed>
) =>
  action$.ofType(GET_DOWNLOAD_URL_FULFILLED).pipe(
    flatMap(action => {
      const url = get(action, "payload.data.download.url", "");
      const open = get(action, "meta.open", false);

      if (!url) return [];
      return [
        open
          ? openFile(action.meta.input.fileId)
          : downloadFile(
              action.meta.input.fileId,
              !!action.meta.input.processId
            )
      ];
    })
  );

export default download;
