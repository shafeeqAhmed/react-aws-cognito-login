// @flow
import { type ShootingEvent } from "src/redux/modules/shooting/events";

export const SELECT_EVENT: "procliq-web-editor/schedule/events/SELECT_EVENT" =
  "procliq-web-editor/schedule/events/SELECT_EVENT";
export const FETCH_EVENTS: "procliq-web-editor/schedule/events/FETCH_EVENTS" =
  "procliq-web-editor/schedule/events/FETCH_EVENTS";

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

export type ScheduleDayEvent = {
  +id: string,
  +version: number,
  +production_id: string,
  +screenplay_id: string,
  +scheduleday_id: string,
  +title: string,
  +description: string,
  +shootingevent_id: ?string,
  +shooting_event: ?ShootingEvent,
  +is_paid: boolean,
  +is_fixed: boolean,
  +calendar_start: string,
  +calendar_end: string,
  +locations: Array<EventLocation>,
  +created_by: string,
  +created_at: string,
  +updated_at: string,
  +deleted_at: ?string,
  +removed_at: ?string
};

export type State = {|
  +currentEventId: $PropertyType<ScheduleDayEvent, "id">,
  +isFetching: boolean,
  +list: Array<ScheduleDayEvent>,
  +error: ?string
|};

const initialState = {
  isFetching: false,
  currentEventId: "1",
  // TODO: replace with API call
  list: [
    {
      id: "1AoKYYcGRAHJ3yx67Om79jiT1ZF",
      version: 8,
      production_id: "4",
      screenplay_id: "1A57Ptq9LRAeJjfoYH7E9SAZpZF",
      scheduleday_id: "1AoKIhwAWAgT3s3BrIC7F5VNZNX",
      title: "Event 1",
      description: "",
      shootingevent_id: null,
      shooting_event: null,
      is_paid: true,
      is_fixed: false,
      calendar_start: "2018-09-28T09:00:00Z",
      calendar_end: "2018-09-28T10:00:00Z",
      locations: [],
      created_by: "8141b964-80dc-4993-a9cc-c79c145aefd7",
      created_at: "2018-09-27T22:32:41Z",
      updated_at: "2018-09-27T23:45:52Z",
      deleted_at: null,
      removed_at: null
    },
    {
      id: "1AoKgWOJhxPiL7wlyEh7UAoITn3",
      version: 10,
      production_id: "4",
      screenplay_id: "1A57Ptq9LRAeJjfoYH7E9SAZpZF",
      scheduleday_id: "1AoKIhwAWAgT3s3BrIC7F5VNZNX",
      title: "Event 4",
      description: "",
      shootingevent_id: null,
      shooting_event: null,
      is_paid: true,
      is_fixed: false,
      calendar_start: "2018-09-28T10:00:00Z",
      calendar_end: "2018-09-28T11:00:00Z",
      locations: [],
      created_by: "8141b964-80dc-4993-a9cc-c79c145aefd7",
      created_at: "2018-09-27T22:33:44Z",
      updated_at: "2018-09-27T23:47:32Z",
      deleted_at: null,
      removed_at: null
    },
    {
      id: "1AoKczH2Edxlq0nM1KtwVvfLQvt",
      version: 10,
      production_id: "4",
      screenplay_id: "1A57Ptq9LRAeJjfoYH7E9SAZpZF",
      scheduleday_id: "1AoTImL8Tn7YNBTSOS6F2za6bYq",
      title: "Event 2",
      description: "",
      shootingevent_id: null,
      shooting_event: null,
      is_paid: true,
      is_fixed: false,
      calendar_start: "2018-09-29T09:30:00Z",
      calendar_end: "2018-09-29T10:30:00Z",
      locations: [],
      created_by: "8141b964-80dc-4993-a9cc-c79c145aefd7",
      created_at: "2018-09-27T22:33:16Z",
      updated_at: "2018-09-27T23:47:32Z",
      deleted_at: null,
      removed_at: null
    },
    {
      id: "1AoKetjCjXCmRrKNo2jsXqKc8Lv",
      version: 10,
      production_id: "4",
      screenplay_id: "1A57Ptq9LRAeJjfoYH7E9SAZpZF",
      scheduleday_id: "1AoTImL8Tn7YNBTSOS6F2za6bYq",
      title: "Event 3",
      description: "",
      shootingevent_id: null,
      shooting_event: null,
      is_paid: true,
      is_fixed: false,
      calendar_start: "2018-09-29T10:30:00Z",
      calendar_end: "2018-09-29T11:30:00Z",
      locations: [],
      created_by: "8141b964-80dc-4993-a9cc-c79c145aefd7",
      created_at: "2018-09-27T22:33:31Z",
      updated_at: "2018-09-27T23:47:32Z",
      deleted_at: null,
      removed_at: null
    }
  ],
  error: ""
};

export default function reducer(
  state: State = initialState,
  action: GlobalFSA<*>
): State {
  switch (action.type) {
    case `${FETCH_EVENTS}_PENDING`:
      return {
        ...state,
        isFetching: true
      };

    case `${FETCH_EVENTS}_FULFILLED`:
      return {
        ...state,
        error: initialState.error,
        isFetching: false,
        list: action.payload
      };

    case `${FETCH_EVENTS}_REJECTED`:
      return {
        ...state,
        isFetching: false,
        error: action.payload
      };

    case `${SELECT_EVENT}`: {
      return {
        ...state,
        currentEventId: action.payload
      };
    }

    default:
      return state;
  }
}

export const selectEvent = (
  eventId: $PropertyType<ScheduleDayEvent, "id">
) => ({
  type: SELECT_EVENT,
  payload: eventId
});
