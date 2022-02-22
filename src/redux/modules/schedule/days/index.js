// @flow
import get from "lodash/get";
import { type ScheduleDayEvent } from "../events";
import {
  listDays,
  type ListScheduleDaysRequest,
  createScheduleDayEvent as createScheduleDayEventApi,
  type CreateScheduleDayEventRequest
} from "./api";

export const SELECT_DAY_EVENT: "procliq-web-editor/schedule/days/SELECT_DAY_EVENT" =
  "procliq-web-editor/schedule/days/SELECT_DAY_EVENT";
export const UNSELECT_DAY_EVENT: "procliq-web-editor/schedule/days/UNSELECT_DAY_EVENT" =
  "procliq-web-editor/schedule/days/UNSELECT_DAY_EVENT";
export const FETCH_DAYS: "procliq-web-editor/schedule/days/FETCH_DAYS" =
  "procliq-web-editor/schedule/days/FETCH_DAYS";
export const SELECT_SCHEDULE_DAY: "procliq-web-editor/schedule/days/SELECT_SCHEDULE_DAY" =
  "procliq-web-editor/schedule/days/SELECT_SCHEDULE_DAY";
export const CREATE_SCHEDULE_DAY_EVENT: "procliq-web-editor/schedule/days/CREATE_SCHEDULE_DAY_EVENT" =
  "procliq-web-editor/schedule/days/CREATE_SCHEDULE_DAY_EVENT";

type DayEventId = $PropertyType<ScheduleDayEvent, "id">;

export type Day = {|
  +id: string,
  +version: number,
  +production_id: string,
  +screenplay_id: string,
  +unit_id: string,
  +type: "callsheet" | "moving" | "day_off" | "unavailable",
  +calendar_date: string,
  +shooting_day: number,
  +locked: boolean,
  +status: "draft" | "prelim" | "published",
  +call_time: string,
  +wrap_goal: string,
  +schedule_day_events: Array<ScheduleDayEvent>,
  +created_by: string,
  +created_at: string,
  +updated_at: string,
  +deleted_at: ?string
|};

type ScheduleDayId = $PropertyType<Day, "id">;

export type State = {|
  +currentDayEventId: DayEventId,
  +isFetching: boolean,
  +list: Array<Day>,
  +error: ?string,
  +currentDayId: ScheduleDayId
|};

const initialState = {
  isFetching: false,
  currentDayEventId: "",
  currentDayId: "",
  list: [],
  error: ""
};

export default function reducer(
  state: State = initialState,
  action: GlobalFSA<*>
): State {
  switch (action.type) {
    case `${FETCH_DAYS}_PENDING`:
    case `${CREATE_SCHEDULE_DAY_EVENT}_PENDING`:
      return {
        ...state,
        isFetching: true
      };

    case `${FETCH_DAYS}_FULFILLED`:
      return {
        ...state,
        error: initialState.error,
        isFetching: false,
        list: get(action, "payload.data.schedule_days")
      };

    case `${FETCH_DAYS}_REJECTED`:
    case `${CREATE_SCHEDULE_DAY_EVENT}_REJECTED`:
      return {
        ...state,
        isFetching: false,
        error: action.payload
      };

    case `${SELECT_DAY_EVENT}`: {
      return {
        ...state,
        currentDayEventId: action.payload
      };
    }

    case `${UNSELECT_DAY_EVENT}`: {
      return {
        ...state,
        currentDayEventId: initialState.currentDayEventId
      };
    }

    case `${SELECT_SCHEDULE_DAY}`: {
      return {
        ...state,
        currentDayId: action.payload
      };
    }

    case `${CREATE_SCHEDULE_DAY_EVENT}_FULFILLED`: {
      const scheduleDay = state.list.find(
        d => d.id === get(action, "meta.input.scheduleDayId")
      );

      if (!scheduleDay) return state;

      scheduleDay.schedule_day_events.push(get(action, "meta.input.event"));

      return {
        ...state,
        list: [
          ...state.list.filter(
            d => d !== get(action, "meta.input.scheduleDayId")
          ),
          scheduleDay
        ]
      };
    }

    // case `${CREATE_SCHEDULE_DAY_EVENT}_REJECTED`:

    default:
      return state;
  }
}

export const fetchScheduleDays = (request: ListScheduleDaysRequest) => ({
  type: FETCH_DAYS,
  payload: listDays(request)
});

export const selectScheduleDay = (id: ScheduleDayId) => ({
  type: SELECT_SCHEDULE_DAY,
  payload: id
});

export const selectDayEvent = (id: DayEventId) => ({
  type: SELECT_DAY_EVENT,
  payload: id
});

export const unselectDayEvent = () => ({
  type: UNSELECT_DAY_EVENT
});

export const createScheduleDayEvent = (
  request: CreateScheduleDayEventRequest
) => ({
  type: CREATE_SCHEDULE_DAY_EVENT,
  payload: createScheduleDayEventApi(request)
});
