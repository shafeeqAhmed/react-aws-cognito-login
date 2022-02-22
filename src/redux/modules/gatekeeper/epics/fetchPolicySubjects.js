// @flow
import { get } from "lodash";
import { flatMap } from "rxjs/operators";
import {
  FETCH_POLICIES_FULFILLED,
  SubjectTypes
} from "src/redux/modules/gatekeeper";
import { fetchUser, fetchTag, fetchDepartment } from "src/redux/modules/users";
import type { Store } from "redux";
import type { RootReducerState } from "src/redux/modules";

/**
 * fetch subjects of a policy when the policy is fetched.
 * TODO: fetch tags and departments too!
 */
const fetchUsers = (
  action$: Object,
  store: Store<RootReducerState, mixed, mixed>
) =>
  action$.ofType(FETCH_POLICIES_FULFILLED).pipe(
    flatMap(action => {
      const policies = get(action, "payload.data.policies", []);

      const userIds = policies.reduce((u, p) => {
        if (p && p.subject && p.subject.type === SubjectTypes.USER) {
          u.push(p.subject.id);
        }

        return u;
      }, []);

      const departmentIds = policies.reduce((u, p) => {
        if (p && p.subject && p.subject.type === SubjectTypes.DEPARTMENT) {
          u.push(p.subject.id);
        }

        return u;
      }, []);

      const tagIds = policies.reduce((u, p) => {
        if (p && p.subject && p.subject.type === SubjectTypes.TAG) {
          u.push(p.subject.id);
        }

        return u;
      }, []);

      return [
        ...userIds.map(id => fetchUser(id)),
        ...departmentIds.map(id =>
          fetchDepartment(action.meta.input.productionId, id)
        ),
        ...tagIds.map(id => fetchTag(action.meta.input.productionId, id))
      ];
    })
  );

export default fetchUsers;
