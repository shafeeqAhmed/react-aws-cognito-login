// @flow
import { flatMap } from "rxjs/operators";
import { get } from "lodash";
import {
  SOUND_INSERTED,
  SOUND_MODIFIED,
  UPDATE_SOUND,
  CREATE_SOUND,
  UPLOAD_SOUND,
  fetchSound
} from "src/redux/modules/sounds";
import type { Store } from "redux";
import type { RootReducerState } from "src/redux/modules";

/**
 * update sound state on notification.
 */
const onSoundNotification = (
  action$: Object,
  store: Store<RootReducerState, mixed, mixed>
) =>
  action$
    .ofType(
      SOUND_INSERTED,
      SOUND_MODIFIED,
      `${UPDATE_SOUND}_REJECTED`,
      `${UPDATE_SOUND}_FULFILLED`,
      `${CREATE_SOUND}_FULFILLED`,
      `${UPLOAD_SOUND}_FULFILLED`
    )
    .pipe(
      flatMap(action => [
        fetchSound({
          teamId: get(
            action,
            "payload.teamId",
            get(action, "meta.request.teamId")
          ),
          soundId: get(
            action,
            "payload.id",
            get(
              action,
              "payload.data.sound.id",
              get(action, "meta.request.soundId")
            )
          )
        })
      ])
    );

export default onSoundNotification;
