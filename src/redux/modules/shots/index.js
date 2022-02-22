// @flow
import { get } from "lodash";
import update from "immutability-helper";
import { setups as setupsMock, shots as shotsMock } from "./mock";
import { upsert } from "src/helpers/lodash";

export const CHANGE_SHOT_SETUP: "procliq-editor-web/shots/CHANGE_SHOT_SETUP" =
  "procliq-editor-web/shots/CHANGE_SHOT_SETUP";
export const SET_TEMP_SETUP: "procliq-editor-web/shots/SET_TEMP_SETUP" =
  "procliq-editor-web/shots/SET_TEMP_SETUP";
export const MOVE_SHOT: "procliq-editor-web/shots/MOVE_SHOT" =
  "procliq-editor-web/shots/MOVE_SHOT";
export const TOGGLE_SHOT_STATUS: "procliq-editor-web/shots/TOGGLE_SHOT_STATUS" =
  "procliq-editor-web/shots/TOGGLE_SHOT_STATUS";

// TODO: replace with the real type
export type Shot = {|
  +id: string,
  +code: string,
  +description: string,
  +segments: Array<{
    +id: string,
    +description: string
  }>,
  +time: string,
  +spentTime: string,
  +remainingTime: string,
  +cameras: number,
  +setupId: string,
  +index?: number,
  +tempSetupId?: string,
  +completed: boolean,
  +backlog?: boolean,
  +relatedSetupId?: string
|};

export type Setup = {
  id: string,
  name: string
};

export type State = {|
  +list: Array<Shot>,
  +setups: Array<Setup>
|};

const initialState = {
  list: shotsMock,
  setups: setupsMock
};

export default function reducer(
  state: State = initialState,
  action: GlobalFSA<*>
): State {
  switch (action.type) {
    case CHANGE_SHOT_SETUP: {
      const newShots = [...state.list];
      const shotId = get(action, "payload.shotId");
      const setupId = get(action, "payload.setupId");

      const index = newShots.findIndex(s => s.id === shotId);

      newShots.splice(index, 1, {
        ...newShots[index],
        setupId,
        relatedSetupId:
          setupId !== "backlog" ? setupId : newShots[index].relatedSetupId,
        backlog: setupId === "backlog" ? true : undefined,
        tempSetupId: undefined
      });

      return {
        ...state,
        list: newShots
      };
    }

    case SET_TEMP_SETUP: {
      const newShots = [...state.list];
      const shotId = get(action, "payload.shotId");
      const setupId = get(action, "payload.setupId");

      const index = newShots.findIndex(s => s.id === shotId);

      newShots.splice(index, 1, {
        ...newShots[index],
        tempSetupId: setupId
      });

      return {
        ...state,
        list: newShots
      };
    }

    case MOVE_SHOT: {
      const dragIndex = get(action, "payload.dragIndex");
      const hoverIndex = get(action, "payload.hoverIndex");
      const { list } = state;
      const dragSetup = list[dragIndex];

      return update(state, {
        list: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragSetup]]
        }
      });
    }

    case TOGGLE_SHOT_STATUS: {
      const shotId = get(action, "payload.shotId");

      const shot = state.list.find(s => s.id === shotId);

      if (!shot) return state;

      return {
        ...state,
        list: upsert(
          state.list,
          { ...shot, completed: !shot.completed },
          s => s.id === shotId
        )
      };
    }

    default:
      return state;
  }
}

export const changeShotSetup = (
  shotId: $PropertyType<Shot, "id">,
  setupId: $PropertyType<Setup, "id">
) => ({
  type: CHANGE_SHOT_SETUP,
  payload: {
    shotId,
    setupId
  }
});

export const setTempSetup = (
  shotId: $PropertyType<Shot, "id">,
  setupId: $PropertyType<Setup, "id">
) => ({
  type: SET_TEMP_SETUP,
  payload: {
    shotId,
    setupId
  }
});

export const moveShot = (dragIndex: number, hoverIndex: number) => ({
  type: MOVE_SHOT,
  payload: {
    dragIndex,
    hoverIndex
  }
});

export const toggleShotStatus = (shotId: $PropertyType<Shot, "id">) => ({
  type: TOGGLE_SHOT_STATUS,
  payload: {
    shotId
  }
});
