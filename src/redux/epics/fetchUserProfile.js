// @flow
import { flatMap, distinct } from "rxjs/operators";
import { USERS_UPDATED } from "src/redux/modules/screenplay";
import { fetchUser } from "src/redux/modules/users";
import getUser from "src/redux/selectors/getUser";
import type { Store } from "redux";
import type { RootReducerState } from "src/redux/modules";

/**
 * fetchUserProfile for users connecting via firepad.
 * When the users connected via firepad change, it triggers USERS_UPDATED.
 * This epic triggers FETCH_USER for any user that had not been fetched before.
 */
const fetchUserProfile = (
  action$: Object,
  store: Store<RootReducerState, mixed, mixed>
) =>
  action$
    .ofType(USERS_UPDATED)
    .pipe(
      flatMap(action =>
        action.payload.users.reduce((toFetch, u) => {
          const userInCache = getUser(store.getState(), u.userId);
          return userInCache ? toFetch : [...toFetch, fetchUser(u.userId)];
        }, [])
      )
    )
    .pipe(distinct(action => action.payload.userId));

export default fetchUserProfile;
