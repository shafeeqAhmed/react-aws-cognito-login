// @flow
import { mock, post, type APIResponseType } from "src/helpers/api";
import env from "config/env";
import { type Day } from "../";

const { MOCK_API, API_URL } = env;

type ListScheduleDaysResponse = {|
  +schedule_days: Array<Day>,
  +limit: number,
  +offset: number
|};

const listScheduleDaysResponseMock: ListScheduleDaysResponse = {
  schedule_days: [
    {
      id: "1BTwvt8ZIwAn7kFBqu0dmpVE2Yu",
      version: 1,
      production_id: "4",
      screenplay_id: "1BOCebWz4qBTtwhDuMUveICH7ne",
      unit_id: "1BTwnlS3kOimbwtuDuFAjThGv23",
      type: "callsheet",
      calendar_date: "2018-10-25T00:00:00Z",
      shooting_day: 1,
      locked: false,
      status: "draft",
      call_time: "08:00",
      wrap_goal: "17:00",
      schedule_day_events: [
        {
          id: "1BU6q6eDa3u36umP6YpnNCgPZzz",
          version: 7,
          production_id: "4",
          screenplay_id: "1BOCebWz4qBTtwhDuMUveICH7ne",
          scheduleday_id: "1BTwvt8ZIwAn7kFBqu0dmpVE2Yu",
          title: "1",
          description: "INT.  WILL'S BEDROOM - NIGHT (1973)",
          shootingevent_id: "1BR2dOuvtTN2iKsTO3UDmZJokpK",
          shooting_event: {
            id: "1BR2dOuvtTN2iKsTO3UDmZJokpK",
            version: 67,
            production_id: "4",
            screenplay_id: "1BOCebWz4qBTtwhDuMUveICH7ne",
            sequence: 1,
            name: "INT.  WILL'S BEDROOM - NIGHT (1973)",
            summary:
              "Sam struggles with John, gets wounded then kills him dead dog.",
            scenes: [
              {
                scene_id: "1BR2cXrgnKVbIJcvdexFmeJ33QG",
                scene_type: "PRIMARY",
                scene_code: "1"
              }
            ],
            code: "1",
            set_id: "1AhcQDEFmwvppZkQvbHt2gCHHPy",
            set: {
              id: "1AhcQDEFmwvppZkQvbHt2gCHHPy",
              type: "INT",
              name: "WILL'S BEDROOM",
              time_of_day: "NIGHT (1973)",
              story_day: ""
            },
            unit_id: "1BTwnlS3kOimbwtuDuFAjThGv23",
            pages: "3/8",
            duration_time: "0:36",
            duration_time_override: "",
            shot_goal: "",
            split_count: 0,
            splitted_from_id: null,
            split_type: "",
            split_index: 0,
            merged_to_id: null,
            generated_from_scene_id: "1BR2cXrgnKVbIJcvdexFmeJ33QG",
            created_by: "8141b964-80dc-4993-a9cc-c79c145aefd7",
            created_at: "2018-10-11T15:27:57Z",
            updated_at: "2018-10-17T00:26:47Z",
            deleted_at: null,
            removed_at: null,
            location: null,
            location_id: "",
            script_day: "",
            elements: []
          },
          is_paid: true,
          is_fixed: false,
          calendar_start: "2018-10-25T08:00:00Z",
          calendar_end: "2018-10-25T10:00:00Z",
          locations: [
            {
              scheduledayevent_id: "1BU6q6eDa3u36umP6YpnNCgPZzz",
              location_id: "1BU7Lj1c8VdV1DFx9nK4veQ4AS5",
              location_type: "main",
              location_name: "Spiderwood Parking Lot",
              location_address: "140 Utley Rd. Elgin, TX 78621",
              location_latitude: "30.2672",
              location_longitude: "97.7431",
              location_notes: ""
            },
            {
              scheduledayevent_id: "1BU6q6eDa3u36umP6YpnNCgPZzz",
              location_id: "1BU9GfdTitPEHumGrusdkAVKpTQ",
              location_type: "hospital",
              location_name: "Main Street Hospital",
              location_address: "123 Main Street, Austin, TX",
              location_latitude: "",
              location_longitude: "",
              location_notes: ""
            }
          ],
          created_by: "8141b964-80dc-4993-a9cc-c79c145aefd7",
          created_at: "2018-10-12T17:31:59Z",
          updated_at: "2018-10-12T19:44:33Z",
          deleted_at: null,
          removed_at: null
        },
        {
          id: "1BU8bzXwRx7WWln3kulUGhVgLBV",
          version: 5,
          production_id: "4",
          screenplay_id: "1BOCebWz4qBTtwhDuMUveICH7ne",
          scheduleday_id: "1BTwvt8ZIwAn7kFBqu0dmpVE2Yu",
          title: "168",
          description: "INT.  HOSPITAL ROOM - NIGHT",
          shootingevent_id: "1BR2dHeDuPjwFMRVP7Ciawg9fUa",
          shooting_event: {
            id: "1BR2dHeDuPjwFMRVP7Ciawg9fUa",
            version: 67,
            production_id: "4",
            screenplay_id: "1BOCebWz4qBTtwhDuMUveICH7ne",
            sequence: 168,
            name: "INT.  HOSPITAL ROOM - NIGHT",
            summary: "",
            scenes: [
              {
                scene_id: "1BR2ckPdKx0DMIhkiSk0zDNNtc8",
                scene_type: "PRIMARY",
                scene_code: "168"
              }
            ],
            code: "168",
            set_id: "1AhcQFH8IPTXTNR3xk2D3SHNt3a",
            set: {
              id: "1AhcQFH8IPTXTNR3xk2D3SHNt3a",
              type: "INT",
              name: "HOSPITAL ROOM",
              time_of_day: "NIGHT",
              story_day: ""
            },
            unit_id: "1BTwnlS3kOimbwtuDuFAjThGv23",
            pages: "7/8",
            duration_time: "1:24",
            duration_time_override: "",
            shot_goal: "",
            split_count: 0,
            splitted_from_id: null,
            split_type: "",
            split_index: 0,
            merged_to_id: null,
            generated_from_scene_id: "1BR2ckPdKx0DMIhkiSk0zDNNtc8",
            created_by: "8141b964-80dc-4993-a9cc-c79c145aefd7",
            created_at: "2018-10-11T15:28:23Z",
            updated_at: "2018-10-17T00:27:02Z",
            deleted_at: null,
            removed_at: null,
            elements: [],
            location: null,
            location_id: "",
            script_day: ""
          },
          is_paid: true,
          is_fixed: false,
          calendar_start: "2018-10-25T10:00:00Z",
          calendar_end: "2018-10-25T12:00:00Z",
          locations: [
            {
              scheduledayevent_id: "1BU8bzXwRx7WWln3kulUGhVgLBV",
              location_id: "1BU9bHrraSgWAUcvDoIgnB10ikm",
              location_type: "main",
              location_name: "Vanderbilt University Medical Center",
              location_address: "1211 Medical Center Dr, Nashville, TN 37232",
              location_latitude: "",
              location_longitude: "",
              location_notes: ""
            }
          ],
          created_by: "8141b964-80dc-4993-a9cc-c79c145aefd7",
          created_at: "2018-10-12T17:46:33Z",
          updated_at: "2018-10-12T19:44:33Z",
          deleted_at: null,
          removed_at: null
        },
        {
          id: "1BUCTZEUFTL65vnDYhQGpSNkKci",
          version: 3,
          production_id: "4",
          screenplay_id: "1BOCebWz4qBTtwhDuMUveICH7ne",
          scheduleday_id: "1BTwvt8ZIwAn7kFBqu0dmpVE2Yu",
          title: "151",
          description: "EXT.  SWAMP SHACK ROAD - ANOTHER DAY",
          shootingevent_id: "1BR2dHeZny39M95ZObIGod2E4Wv",
          shooting_event: {
            id: "1BR2dHeZny39M95ZObIGod2E4Wv",
            version: 68,
            production_id: "4",
            screenplay_id: "1BOCebWz4qBTtwhDuMUveICH7ne",
            sequence: 151,
            name: "EXT.  SWAMP SHACK ROAD - ANOTHER DAY",
            summary:
              "Sam struggles with John, gets wounded then kills him dead dog.",
            scenes: [
              {
                scene_id: "1BR2ckR2iHuZKvRI7t7KuZwpClv",
                scene_type: "PRIMARY",
                scene_code: "151"
              }
            ],
            code: "151",
            set_id: "1AhcQEMIVTk8J1NWjyhYFGEmHQS",
            set: {
              id: "1AhcQEMIVTk8J1NWjyhYFGEmHQS",
              type: "EXT",
              name: "SWAMP SHACK ROAD",
              time_of_day: "ANOTHER DAY",
              story_day: ""
            },
            unit_id: "1BTwnlS3kOimbwtuDuFAjThGv23",
            pages: "1/8",
            duration_time: "0:12",
            duration_time_override: "",
            shot_goal: "",
            split_count: 0,
            splitted_from_id: null,
            split_type: "",
            split_index: 0,
            merged_to_id: null,
            generated_from_scene_id: "1BR2ckR2iHuZKvRI7t7KuZwpClv",
            created_by: "8141b964-80dc-4993-a9cc-c79c145aefd7",
            created_at: "2018-10-11T15:28:20Z",
            updated_at: "2018-10-17T00:27:00Z",
            deleted_at: null,
            removed_at: null,
            elements: [],
            location: null,
            location_id: "",
            script_day: ""
          },
          is_paid: true,
          is_fixed: false,
          calendar_start: "2018-10-25T13:00:00Z",
          calendar_end: "2018-10-25T15:00:00Z",
          locations: [],
          created_by: "8141b964-80dc-4993-a9cc-c79c145aefd7",
          created_at: "2018-10-12T18:18:19Z",
          updated_at: "2018-10-12T19:44:33Z",
          deleted_at: null,
          removed_at: null
        },
        {
          id: "1BUCZqFyhi39F8AJlqWtBBaHqag",
          version: 3,
          production_id: "4",
          screenplay_id: "1BOCebWz4qBTtwhDuMUveICH7ne",
          scheduleday_id: "1BTwvt8ZIwAn7kFBqu0dmpVE2Yu",
          title: "Lunch",
          description: "",
          shootingevent_id: null,
          shooting_event: null,
          is_paid: true,
          is_fixed: false,
          calendar_start: "2018-10-25T12:00:00Z",
          calendar_end: "2018-10-25T13:00:00Z",
          locations: [
            {
              scheduledayevent_id: "1BUCZqFyhi39F8AJlqWtBBaHqag",
              location_id: "1BUCw4Bsvrw9fwF2vvpQvbA7keT",
              location_type: "main",
              location_name: "Prince's Hot Chicken Shack South",
              location_address:
                "5814 Nolensville Pike #110, Nashville, TN 37211",
              location_latitude: "",
              location_longitude: "",
              location_notes: ""
            }
          ],
          created_by: "8141b964-80dc-4993-a9cc-c79c145aefd7",
          created_at: "2018-10-12T18:19:10Z",
          updated_at: "2018-10-12T19:44:33Z",
          deleted_at: null,
          removed_at: null
        },
        {
          id: "1BUMxgRLH1dVBCrOU5Wg9C8CL1S",
          version: 1,
          production_id: "4",
          screenplay_id: "1BOCebWz4qBTtwhDuMUveICH7ne",
          scheduleday_id: "1BTwvt8ZIwAn7kFBqu0dmpVE2Yu",
          title: "2",
          description: "EXT.  CAMPFIRE - NIGHT (1977)",
          shootingevent_id: "1BR2dIucofqsD1qUtHcvwXpwWsP",
          shooting_event: {
            id: "1BR2dIucofqsD1qUtHcvwXpwWsP",
            version: 67,
            production_id: "4",
            screenplay_id: "1BOCebWz4qBTtwhDuMUveICH7ne",
            sequence: 2,
            name: "EXT.  CAMPFIRE - NIGHT (1977)",
            summary:
              "A few years later, and Will sits with the other INDIAN GUIDES as Edward continues telling the story to the tribe.",
            scenes: [
              {
                scene_id: "1BR2cXLKyfMlZhqnlGifUUmK2I9",
                scene_type: "PRIMARY",
                scene_code: "2"
              }
            ],
            code: "2",
            set_id: "1AhcQCS5vQ7rid1zEfv6FyTOQLa",
            set: {
              id: "1AhcQCS5vQ7rid1zEfv6FyTOQLa",
              type: "EXT",
              name: "CAMPFIRE",
              time_of_day: "NIGHT (1977)",
              story_day: ""
            },
            unit_id: "1BTwnlS3kOimbwtuDuFAjThGv23",
            pages: "5/8",
            duration_time: "1:00",
            duration_time_override: "",
            shot_goal: "",
            split_count: 0,
            splitted_from_id: null,
            split_type: "",
            split_index: 0,
            merged_to_id: null,
            generated_from_scene_id: "1BR2cXLKyfMlZhqnlGifUUmK2I9",
            created_by: "8141b964-80dc-4993-a9cc-c79c145aefd7",
            created_at: "2018-10-11T15:27:57Z",
            updated_at: "2018-10-17T00:26:47Z",
            deleted_at: null,
            removed_at: null,
            elements: [],
            location: null,
            location_id: "",
            script_day: ""
          },
          is_paid: true,
          is_fixed: false,
          calendar_start: "2018-10-25T15:00:00Z",
          calendar_end: "2018-10-25T17:00:00Z",
          locations: [],
          created_by: "8141b964-80dc-4993-a9cc-c79c145aefd7",
          created_at: "2018-10-12T19:44:33Z",
          updated_at: "2018-10-12T19:44:33Z",
          deleted_at: null,
          removed_at: null
        }
      ],
      created_by: "8141b964-80dc-4993-a9cc-c79c145aefd7",
      created_at: "2018-10-12T16:10:31Z",
      updated_at: "2018-10-12T16:10:31Z",
      deleted_at: null
    },
    {
      id: "1BTwxaujGy1U4LGDEoIn5oBoamF",
      version: 1,
      production_id: "4",
      screenplay_id: "1BOCebWz4qBTtwhDuMUveICH7ne",
      unit_id: "1BTwnlS3kOimbwtuDuFAjThGv23",
      type: "callsheet",
      calendar_date: "2018-10-26T00:00:00Z",
      shooting_day: 0,
      locked: false,
      status: "draft",
      call_time: "08:00",
      wrap_goal: "17:00",
      schedule_day_events: [],
      created_by: "8141b964-80dc-4993-a9cc-c79c145aefd7",
      created_at: "2018-10-12T16:10:44Z",
      updated_at: "2018-10-12T16:10:44Z",
      deleted_at: null
    },
    {
      id: "1BTx0rZOkRZnSJsz6A9OTnOSBEp",
      version: 1,
      production_id: "4",
      screenplay_id: "1BOCebWz4qBTtwhDuMUveICH7ne",
      unit_id: "1BTwnlS3kOimbwtuDuFAjThGv23",
      type: "callsheet",
      calendar_date: "2018-10-27T00:00:00Z",
      shooting_day: 0,
      locked: false,
      status: "draft",
      call_time: "08:00",
      wrap_goal: "17:00",
      schedule_day_events: [],
      created_by: "8141b964-80dc-4993-a9cc-c79c145aefd7",
      created_at: "2018-10-12T16:11:10Z",
      updated_at: "2018-10-12T16:11:10Z",
      deleted_at: null
    },
    {
      id: "1BTx3ctS9jDymndtvpAX2yi1fmv",
      version: 1,
      production_id: "4",
      screenplay_id: "1BOCebWz4qBTtwhDuMUveICH7ne",
      unit_id: "1BTwnlS3kOimbwtuDuFAjThGv23",
      type: "callsheet",
      calendar_date: "2018-10-28T00:00:00Z",
      shooting_day: 4,
      locked: false,
      status: "draft",
      call_time: "08:00",
      wrap_goal: "17:00",
      schedule_day_events: [],
      created_by: "8141b964-80dc-4993-a9cc-c79c145aefd7",
      created_at: "2018-10-12T16:11:33Z",
      updated_at: "2018-10-12T16:11:33Z",
      deleted_at: null
    }
  ],
  limit: 5,
  offset: 0
};

export type ListScheduleDaysRequest = {|
  productionId: string,
  screenplayId: string,
  limit?: number,
  offset?: number,
  from?: string,
  to?: string
|};

export const listScheduleDays = ({
  productionId,
  screenplayId,
  limit = 100,
  offset = 0,
  from,
  to
}: ListScheduleDaysRequest): Promise<
  APIResponseType<ListScheduleDaysResponse>
> =>
  MOCK_API
    ? mock(listScheduleDaysResponseMock)
    : post(`${API_URL}/v1/productions/${productionId}/scheduledays/list`, {
        screenplay_id: screenplayId,
        limit,
        offset,
        calendar_date_from: from,
        calendar_date_to: to
      });

export default listScheduleDays;
