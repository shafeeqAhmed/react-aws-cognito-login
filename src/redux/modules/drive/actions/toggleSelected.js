// @flow
export const TOGGLE_SELECTED = ("procliq-web-editor/drive/TOGGLE_SELECTED": "procliq-web-editor/drive/TOGGLE_SELECTED");

export type ToggleSelectedAction = {
  type: typeof TOGGLE_SELECTED,
  payload: { fileIds: Array<string> }
};

export const toggleSelected = (
  fileIds: Array<string>
): ToggleSelectedAction => ({
  type: TOGGLE_SELECTED,
  payload: { fileIds }
});
