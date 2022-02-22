// @flow
import get from "lodash/get";
import filter from "lodash/filter";
import {
  listShootingEvents,
  type ListShootingEventsRequest,
  listNotScheduledEvents,
  type ListNotScheduledEventsRequest
} from "./api";
import { type Scene } from "src/redux/modules/scenes";
import { type Element } from "src/redux/modules/elements";

export const SELECT_EVENT: "procliq-web-editor/shooting/events/SELECT_EVENT" =
  "procliq-web-editor/shooting/events/SELECT_EVENT";
export const FETCH_EVENTS: "procliq-web-editor/shooting/events/FETCH_EVENTS" =
  "procliq-web-editor/shooting/events/FETCH_EVENTS";
export const SEARCH_EVENTS: "procliq-web-editor/shooting/events/SEARCH_EVENTS" =
  "procliq-web-editor/shooting/events/SEARCH_EVENTS";
export const FETCH_NOT_SCHEDULED_EVENTS: "procliq-web-editor/shooting/events/FETCH_NOT_SCHEDULED_EVENTS" =
  "procliq-web-editor/shooting/events/FETCH_NOT_SCHEDULED_EVENTS";
export const REMOVE_EVENT_FROM_NOT_SCHEDULED: "procliq-web-editor/shooting/events/REMOVE_EVENT_FROM_NOT_SCHEDULED" =
  "procliq-web-editor/shooting/events/REMOVE_EVENT_FROM_NOT_SCHEDULED";

type ShootingEventScene = {|
  +scene_id: $PropertyType<Scene, "id">,
  +scene_type: string,
  +scene_code: $PropertyType<Scene, "code">
|};

export type Set = {|
  +id: string,
  +type: "EXT" | "INT" | "I/E" | "EST",
  +name: string,
  +time_of_day: string,
  +story_day: string
|};

export const CategoryTypes = {
  CREW: ("crew": "crew"),
  CAST: ("cast": "cast"),
  EXTRAS: ("extras": "extras"),
  CUSTOM: ("custom": "custom")
};

export type CategoryType = $Values<typeof CategoryTypes>;

export type ShootingEventElement = {|
  +id: string,
  +name: string,
  +related_id: string,
  +category_id: string,
  +category_type: CategoryType
|};

export type EventLocation = {
  scheduledayevent_id: string,
  location_id: string,
  location_type: string,
  location_name: string,
  location_address: string,
  location_latitude: string,
  location_longitude: string,
  location_notes: string
};

export type ShootingEvent = {|
  +id: string,
  +version: number,
  +production_id: string,
  +screenplay_id: string,
  +sequence: number,
  +name: string,
  +summary: string,
  +scenes: Array<ShootingEventScene>,
  +elements: Array<ShootingEventElement>,
  +code: string,
  +set_id: ?$PropertyType<Set, "id">,
  +set: ?Set,
  +unit_id: ?string,
  +pages: string,
  +duration_time: string,
  +duration_time_override: string,
  +shot_goal: string,
  +split_count: number,
  +splitted_from_id: ?string,
  +split_type: string,
  +split_index: number,
  +merged_to_id: ?string,
  +generated_from_scene_id: string,
  +created_by: string,
  +created_at: string,
  +updated_at: string,
  +deleted_at: ?string,
  +removed_at: ?string,
  +elements?: Array<Element>,
  +location: ?EventLocation,
  +location_id: ?$PropertyType<EventLocation, "location_id">,
  +script_day: ?string
|};

export type State = {|
  +currentEventId: $PropertyType<ShootingEvent, "id">,
  +isFetching: boolean,
  +list: Array<ShootingEvent>,
  +stripboardSearchResults: Array<ShootingEvent>,
  +error: ?string
|};

const initialState = {
  isFetching: false,
  currentEventId: "",
  list: [],
  stripboardSearchResults: [],
  error: ""
};

export default function reducer(
  state: State = initialState,
  action: GlobalFSA<*>
): State {
  switch (action.type) {
    case `${SEARCH_EVENTS}_PENDING`:
    case `${FETCH_NOT_SCHEDULED_EVENTS}_PENDING`:
      return {
        ...state,
        isFetching: true
      };

    case `${SEARCH_EVENTS}_FULFILLED`:
      return {
        ...state,
        error: initialState.error,
        isFetching: false,
        stripboardSearchResults: get(action, "payload.data.shooting_events")
      };

    case `${SEARCH_EVENTS}_REJECTED`:
    case `${FETCH_NOT_SCHEDULED_EVENTS}_REJECTED`:
      return {
        ...state,
        isFetching: false,
        error: action.payload
      };

    case `${FETCH_NOT_SCHEDULED_EVENTS}_FULFILLED`:
      return {
        ...state,
        isFetching: false,
        list: get(action, "payload.data.shooting_events")
      };

    case REMOVE_EVENT_FROM_NOT_SCHEDULED:
      return {
        ...state,
        list: filter(state.list, e => e.id !== action.payload)
      };

    default:
      return state;
  }
}

export const fetchNotScheduledEvents = (
  request: ListNotScheduledEventsRequest
) => ({
  type: FETCH_NOT_SCHEDULED_EVENTS,
  payload: listNotScheduledEvents(request)
});

export const searchShootingEvents = (request: ListShootingEventsRequest) => ({
  type: SEARCH_EVENTS,
  payload: listShootingEvents(request)
});

export const removeEventFromNotScheduled = (id: string) => ({
  type: REMOVE_EVENT_FROM_NOT_SCHEDULED,
  payload: id
});
