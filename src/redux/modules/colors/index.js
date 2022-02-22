// @flow
import get from "lodash/get";
import * as api from "./api";

import type { Production } from "src/redux/modules/productions";
import type { SetType } from "src/redux/modules/screenplay";
// export * from "./selectors";

export const FETCH_COLORS: "procliq-web-editor/colors/FETCH_COLORS" =
  "procliq-web-editor/colors/FETCH_COLORS";

export const ColorTypes = {
  strip: ("strip": "strip"),
  free_day: ("free_day": "free_day"),
  banner: ("banner": "banner"),
  holiday: ("holiday": "holiday"),
  day_break: ("day_break": "day_break"),
  week_separator: ("week_separator": "week_separator")
};

export type ColorType = $Values<typeof ColorTypes>;

export type Color = {|
  +id: string,
  +version: number,
  +production_id: $PropertyType<Production, "id">,
  +type: ColorType,
  +set_type: SetType,
  +set_timeofday: string,
  +value: string,
  +created_by: string,
  +created_at: string,
  +updated_at: ?string,
  +deleted_at: ?string
|};

export type State = {|
  +isFetching: boolean,
  +list: Array<Color>,
  +error: ?string
|};

const initialState = {
  isFetching: false,
  list: [],
  error: ""
};

export default function reducer(
  state: State = initialState,
  action: GlobalFSA<*>
): State {
  switch (action.type) {
    case `${FETCH_COLORS}_PENDING`:
      return {
        ...state,
        isFetching: true
      };

    case `${FETCH_COLORS}_FULFILLED`:
      return {
        ...state,
        list: get(action, "payload.data.colors")
      };

    case `${FETCH_COLORS}_REJECTED`:
      return {
        ...state
      };

    default:
      return state;
  }
}

export const fetchColors = (request: api.ListColorsRequest) => ({
  type: FETCH_COLORS,
  payload: api.listColors(request)
});
