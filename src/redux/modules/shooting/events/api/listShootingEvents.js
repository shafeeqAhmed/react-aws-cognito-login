// @flow
import { mock, post, type APIResponseType } from "src/helpers/api";
import env from "config/env";
import { type ShootingEvent } from "../";

const { MOCK_API, API_URL } = env;

type ListShootingEventsResponse = {|
  +shooting_events: Array<ShootingEvent>,
  +limit: number,
  +offset: number
|};

const listShootingEventsResponseMock: ListShootingEventsResponse = {
  shooting_events: [
    {
      id: "1FIyaEwj2ekvhUTrFcYZ0g0bkgp",
      version: 5,
      production_id: "1",
      screenplay_id: "1FIyaA4SzHsdgKyV9hFgqw1v1tZ",
      sequence: 1,
      name: "Gregory Alexander",
      summary: "Sam struggles with John, gets wounded then kills him dead dog.",
      scenes: [
        {
          scene_id: "1FIyaAphtJcsB4Rl8rxI3FCKwuK",
          scene_type: "PRIMARY",
          scene_code: "2"
        },
        {
          scene_id: "1FIyaHYb9VZ1J8UeFioV5z5wycR",
          scene_type: "PRIMARY",
          scene_code: "A1"
        }
      ],
      elements: [],
      code: "2,A1",
      set_id: "1FIyaE5b1czv5Xbn1HezwT8YmQd",
      set: null,
      unit_id: null,
      pages: "",
      duration_time: "0:00",
      duration_time_override: "3:20",
      shot_goal: "8",
      split_count: 0,
      splitted_from_id: null,
      split_type: "",
      split_index: 0,
      merged_to_id: null,
      generated_from_scene_id: "1FIyaAphtJcsB4Rl8rxI3FCKwuK",
      location_id: null,
      location: null,
      script_day: "",
      created_by: "50393f98-fe11-47e9-a237-8ecde9b02690",
      created_at: "2019-01-04T14:09:29Z",
      updated_at: "2019-01-04T14:09:29Z",
      deleted_at: null,
      removed_at: null
    },
    {
      id: "1FIyaF0PvlolyTslrfw3C24G65Q",
      version: 3,
      production_id: "1",
      screenplay_id: "1FIyaA4SzHsdgKyV9hFgqw1v1tZ",
      sequence: 18,
      name: "Mrs. Ms. Miss Amanda Hughes",
      summary: "Sam struggles with John, gets wounded then kills him dead dog.",
      scenes: [
        {
          scene_id: "1FIyaEhCBdkMxRyf2nMEcq85ULv",
          scene_type: "PRIMARY",
          scene_code: "1"
        }
      ],
      elements: [],
      code: "1",
      set_id: "1FIyaFqrgJRwGt6jDfTxebKxj3z",
      set: null,
      unit_id: null,
      pages: "",
      duration_time: "",
      duration_time_override: "4:05",
      shot_goal: "10",
      split_count: 0,
      splitted_from_id: null,
      split_type: "",
      split_index: 0,
      merged_to_id: null,
      generated_from_scene_id: "1FIyaEhCBdkMxRyf2nMEcq85ULv",
      location_id: null,
      location: null,
      script_day: "",
      created_by: "50393f98-fe11-47e9-a237-8ecde9b02690",
      created_at: "2019-01-04T14:09:29Z",
      updated_at: "2019-01-04T14:09:29Z",
      deleted_at: null,
      removed_at: null
    }
  ],
  limit: 10,
  offset: 0
};

export type ListShootingEventsRequest = {|
  productionId: string,
  screenplayId: string,
  name?: string,
  sortBySchedule?: boolean,
  limit?: number,
  offset?: number
|};

export const listShootingEvents = ({
  productionId,
  screenplayId,
  name = "",
  sortBySchedule = true,
  limit = 100,
  offset = 0
}: ListShootingEventsRequest): Promise<
  APIResponseType<ListShootingEventsResponse>
> =>
  MOCK_API
    ? mock(listShootingEventsResponseMock)
    : post(`${API_URL}/v1/productions/${productionId}/shootingevents/list`, {
        screenplay_id: screenplayId,
        name,
        sort_by_schedule: sortBySchedule,
        limit,
        offset
      });

export default listShootingEvents;
