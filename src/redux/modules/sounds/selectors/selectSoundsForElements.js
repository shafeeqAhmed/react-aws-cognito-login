// @flow
import { createSelector } from "reselect";
import { get } from "lodash";
import type { Sound } from "src/redux/modules/sounds";
import type { RootReducerState } from "src/redux/modules";
import { ElementItemTypes, type Element } from "src/redux/modules/elements";

const getSounds = (state: RootReducerState) => state.sounds.list;
const getElements = (state: RootReducerState, elements: Array<Element>) =>
  elements;

const selectSoundsForElements: (
  RootReducerState,
  Array<Element>
) => Array<Sound> = createSelector(
  [getSounds, getElements],
  (sounds, elements) => {
    const soundIds = elements.reduce(
      (ids, el) => [
        ...ids,
        ...get(el, "items", [])
          .filter(i => i.item_type === ElementItemTypes.SOUND)
          .map(i => i.item_id)
      ],
      []
    );

    return sounds.filter(s => soundIds.includes(s.id) && !s.deleted_at);
  }
);

export default selectSoundsForElements;
