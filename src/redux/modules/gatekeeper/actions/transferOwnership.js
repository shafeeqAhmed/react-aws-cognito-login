// @flow
import type { APIError, APIResponseType } from "src/helpers/api";
import {
  transferOwnership as transferOwnershipApi,
  type TransferOwnershipInput,
  type TransferOwnershipOutput
} from "src/redux/modules/gatekeeper/api";
import type { Resource } from "src/redux/modules/gatekeeper";

export const TRANSFER_OWNERSHIP = ("procliq-web-editor/gatekeeper/TRANSFER_OWNERSHIP": "procliq-web-editor/gatekeeper/TRANSFER_OWNERSHIP");
export const TRANSFER_OWNERSHIP_PENDING = ("procliq-web-editor/gatekeeper/TRANSFER_OWNERSHIP_PENDING": "procliq-web-editor/gatekeeper/TRANSFER_OWNERSHIP_PENDING");
export const TRANSFER_OWNERSHIP_FULFILLED = ("procliq-web-editor/gatekeeper/TRANSFER_OWNERSHIP_FULFILLED": "procliq-web-editor/gatekeeper/TRANSFER_OWNERSHIP_FULFILLED");
export const TRANSFER_OWNERSHIP_REJECTED = ("procliq-web-editor/gatekeeper/TRANSFER_OWNERSHIP_REJECTED": "procliq-web-editor/gatekeeper/TRANSFER_OWNERSHIP_REJECTED");

export type TransferOwnership = {
  type: typeof TRANSFER_OWNERSHIP,
  payload: Promise<APIResponseType<TransferOwnershipOutput>>,
  meta: {
    input: TransferOwnershipInput
  }
};

export type TransferOwnershipPending = {
  type: typeof TRANSFER_OWNERSHIP_PENDING,
  meta: {
    input: TransferOwnershipInput
  }
};

export type TransferOwnershipFulfilled = {
  type: typeof TRANSFER_OWNERSHIP_FULFILLED,
  payload: APIResponseType<TransferOwnershipOutput>,
  meta: {
    input: TransferOwnershipInput
  }
};

export type TransferOwnershipRejected = {
  type: typeof TRANSFER_OWNERSHIP_REJECTED,
  payload: APIError,
  meta: {
    input: TransferOwnershipInput
  }
};

export const transferOwnership = (
  productionId: number,
  resource: Resource,
  userId: string
): TransferOwnership => ({
  type: TRANSFER_OWNERSHIP,
  payload: transferOwnershipApi({ productionId, resource, userId }),
  meta: {
    input: { productionId, resource, userId }
  }
});
