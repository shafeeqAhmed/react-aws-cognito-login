// @flow
import ksuid from "ksuid";
import type { APIError, APIResponseType } from "src/helpers/api";
import {
  createPolicy as createPolicyApi,
  type CreatePolicyInput,
  type CreatePolicyOutput
} from "src/redux/modules/gatekeeper/api";
import {
  type Resource,
  type Subject,
  type Effect,
  type Action,
  Effects
} from "src/redux/modules/gatekeeper";

export const CREATE_POLICY = ("procliq-web-editor/gatekeeper/CREATE_POLICY": "procliq-web-editor/gatekeeper/CREATE_POLICY");
export const CREATE_POLICY_PENDING = ("procliq-web-editor/gatekeeper/CREATE_POLICY_PENDING": "procliq-web-editor/gatekeeper/CREATE_POLICY_PENDING");
export const CREATE_POLICY_FULFILLED = ("procliq-web-editor/gatekeeper/CREATE_POLICY_FULFILLED": "procliq-web-editor/gatekeeper/CREATE_POLICY_FULFILLED");
export const CREATE_POLICY_REJECTED = ("procliq-web-editor/gatekeeper/CREATE_POLICY_REJECTED": "procliq-web-editor/gatekeeper/CREATE_POLICY_REJECTED");

export type CreatePolicyMeta = {
  input: CreatePolicyInput,
  id: string
};

export type CreatePolicy = {
  type: typeof CREATE_POLICY,
  payload: Promise<APIResponseType<CreatePolicyOutput>>,
  meta: CreatePolicyMeta
};

export type CreatePolicyPending = {
  type: typeof CREATE_POLICY_PENDING,
  meta: CreatePolicyMeta
};

export type CreatePolicyFulfilled = {
  type: typeof CREATE_POLICY_FULFILLED,
  payload: APIResponseType<CreatePolicyOutput>,
  meta: CreatePolicyMeta
};

export type CreatePolicyRejected = {
  type: typeof CREATE_POLICY_REJECTED,
  payload: APIError,
  meta: CreatePolicyMeta
};

export const createPolicy = (
  productionId: number,
  resource: Resource,
  subject: Subject,
  action: Action,
  effect?: Effect = Effects.ALLOW
): CreatePolicy => ({
  type: CREATE_POLICY,
  payload: createPolicyApi({ productionId, resource, subject, effect, action }),
  meta: {
    input: { productionId, resource, subject, effect, action },
    id: ksuid.randomSync().string
  }
});
