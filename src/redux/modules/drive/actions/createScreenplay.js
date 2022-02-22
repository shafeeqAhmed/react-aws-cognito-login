// @flow
import { createScreenplayFile } from "src/redux/modules/drive/api";
import type {
  CreateScreenplayFileInput,
  CreateScreenplayFileOutput
} from "src/redux/modules/drive/api";
import type { APIError, APIResponseType } from "src/helpers/api";

export const CREATE_SCREENPLAY = ("procliq-web-editor/drive/CREATE_SCREENPLAY": "procliq-web-editor/drive/CREATE_SCREENPLAY");
export const CREATE_SCREENPLAY_PENDING = ("procliq-web-editor/drive/CREATE_SCREENPLAY_PENDING": "procliq-web-editor/drive/CREATE_SCREENPLAY_PENDING");
export const CREATE_SCREENPLAY_FULFILLED = ("procliq-web-editor/drive/CREATE_SCREENPLAY_FULFILLED": "procliq-web-editor/drive/CREATE_SCREENPLAY_FULFILLED");
export const CREATE_SCREENPLAY_REJECTED = ("procliq-web-editor/drive/CREATE_SCREENPLAY_REJECTED": "procliq-web-editor/drive/CREATE_SCREENPLAY_REJECTED");

export type CreateScreenplayAction = {
  type: typeof CREATE_SCREENPLAY,
  payload: Promise<APIResponseType<CreateScreenplayFileOutput>>,
  meta: {
    input: CreateScreenplayFileInput
  }
};

export type CreateScreenplayActionPending = {
  type: typeof CREATE_SCREENPLAY_PENDING,
  meta: {
    input: CreateScreenplayFileInput
  }
};

export type CreateScreenplayActionFulfilled = {
  type: typeof CREATE_SCREENPLAY_FULFILLED,
  payload: APIResponseType<CreateScreenplayFileOutput>,
  meta: {
    input: CreateScreenplayFileInput
  }
};

export type CreateScreenplayActionRejected = {
  type: typeof CREATE_SCREENPLAY_REJECTED,
  error: APIError,
  meta: {
    input: CreateScreenplayFileInput
  }
};

export const createScreenplay = (
  productionId: number,
  name: string,
  folderId?: string
): CreateScreenplayAction => ({
  type: CREATE_SCREENPLAY,
  payload: createScreenplayFile({ productionId, name, folderId }),
  meta: {
    input: { productionId, name, folderId }
  }
});
