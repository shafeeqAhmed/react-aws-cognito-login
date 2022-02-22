// @flow
import * as reducers from "./reducers";
import * as actions from "./actions";

export * from "./actions";
export * from "./selectors";

export const Effects = {
  ALLOW: ("allow": "allow"),
  DENY: ("deny": "deny")
};

export type Effect = $Values<typeof Effects>;

export const SubjectTypes = {
  USER: ("user": "user"),
  DEPARTMENT: ("department": "department"),
  TAG: ("tag": "tag")
};

export type SubjectType = $Values<typeof SubjectTypes>;

export type Subject = {
  type: SubjectType,
  id: string
};

export const ResourceTypes = {
  FILE: ("file": "file")
};

export type ResourceType = $Values<typeof ResourceTypes>;

export type Resource = {
  type: ResourceType,
  id: string
};

export const Actions = {
  ADMIN: ("admin": "admin"),
  EDIT: ("edit": "edit"),
  VIEW: ("view": "view"),
  NONE: ("none": "none")
};

export type Action = $Values<typeof Actions>;

export type Policy = {
  id: string,
  version: number,
  productionId: number,
  effect: Effect,
  subject: Subject,
  resource: Resource,
  action: Action,
  createdBy: string,
  createdAt: string,
  updatedAt: string,
  deletedAt: ?string
};

export type Policies = { [id: string]: Policy };

export type State = {
  +policies: Policies,
  +isFetching: boolean,
  +error: ?string
};

export const initialState: State = {
  policies: {},
  isFetching: false,
  error: null
};

export default function reducer(
  state: State = initialState,
  action: GlobalFSA<*>
): State {
  switch (action.type) {
    case actions.FETCH_POLICIES_PENDING:
      return reducers.fetchPoliciesPending(
        state,
        ((action: any): actions.FetchPoliciesPending)
      );

    case actions.FETCH_POLICIES_FULFILLED:
      return reducers.fetchPoliciesFulfilled(
        state,
        ((action: any): actions.FetchPoliciesFulfilled)
      );

    case actions.FETCH_POLICIES_REJECTED:
      return reducers.fetchPoliciesRejected(
        state,
        ((action: any): actions.FetchPoliciesRejected)
      );

    case actions.CREATE_POLICY_PENDING:
      return reducers.createPolicyPending(
        state,
        ((action: any): actions.CreatePolicyPending)
      );

    case actions.CREATE_POLICY_FULFILLED:
      return reducers.createPolicyFulfilled(
        state,
        ((action: any): actions.CreatePolicyFulfilled)
      );

    case actions.CREATE_POLICY_REJECTED:
      return reducers.createPolicyRejected(
        state,
        ((action: any): actions.CreatePolicyRejected)
      );

    case actions.DELETE_POLICY_PENDING:
      return reducers.deletePolicyPending(
        state,
        ((action: any): actions.DeletePolicyPending)
      );

    case actions.DELETE_POLICY_FULFILLED:
      return reducers.deletePolicyFulfilled(
        state,
        ((action: any): actions.DeletePolicyFulfilled)
      );

    case actions.DELETE_POLICY_REJECTED:
      return reducers.deletePolicyRejected(
        state,
        ((action: any): actions.DeletePolicyRejected)
      );

    default:
      return state;
  }
}
