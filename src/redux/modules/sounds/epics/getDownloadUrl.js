// @flow
import { get } from "lodash";
import { flatMap } from "rxjs/operators";
import { GET_DOWNLOAD_URL, downloadFromUrl } from "src/redux/modules/sounds";
import type { Store } from "redux";
import type { RootReducerState } from "src/redux/modules";

/**
 * download file once the download url is generated.
 */
const download = (
  action$: Object,
  store: Store<RootReducerState, mixed, mixed>
) =>
  action$.ofType(`${GET_DOWNLOAD_URL}_FULFILLED`).pipe(
    flatMap(action => {
      const req = get(action, "meta.request", {});
      const res = get(action, "payload.data", {});

      // if no url is returned, a background process may be generating a zip file
      // a `notification` iot message will be sent when process finishes and a zip file is available
      if (!res.url) return [];

      const state = store.getState();
      const soundId = req.soundIds[0];
      const sound = state.sounds.list[soundId];

      return [downloadFromUrl({ ...res, sound })];
    })
  );

export default download;
