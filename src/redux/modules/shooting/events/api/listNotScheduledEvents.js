// @flow
import { mock, post, type APIResponseType } from "src/helpers/api";
import env from "config/env";
import { type ShootingEvent } from "../";

const { MOCK_API, API_URL } = env;

type ListNotScheduledEventsResponse = {|
  +shooting_events: Array<ShootingEvent>
|};

const listNotScheduledEventsResponseMock: ListNotScheduledEventsResponse = {
  shooting_events: [
    {
      id: "1ACjMGttzLlHFaNq54j86OUyp4u",
      version: 13,
      production_id: "4",
      screenplay_id: "1A57Ptq9LRAeJjfoYH7E9SAZpZF",
      sequence: 5,
      name: ".OPENING TITLES",
      summary: "",
      scenes: [
        {
          scene_id: "1ACjL85r7sB1W43RND57bKrZif7",
          scene_type: "PRIMARY",
          scene_code: "5"
        }
      ],
      elements: [],
      code: "5",
      set_id: null,
      set: null,
      unit_id: "1ARYwpbZ4NoB3VVNtX7E9aLrMZc",
      pages: "",
      duration_time: "0:00",
      duration_time_override: "",
      shot_goal: "",
      split_count: 0,
      splitted_from_id: null,
      split_type: "",
      split_index: 0,
      merged_to_id: null,
      generated_from_scene_id: "1ACjL85r7sB1W43RND57bKrZif7",
      location_id: null,
      location: null,
      script_day: "",
      created_by: "8141b964-80dc-4993-a9cc-c79c145aefd7",
      created_at: "2018-09-14T15:03:48Z",
      updated_at: "2019-01-03T21:56:55Z",
      deleted_at: null,
      removed_at: null
    }
  ]
};

export type ListNotScheduledEventsRequest = {|
  productionId: string,
  unitId?: string
|};

export const listNotScheduledEvents = ({
  productionId,
  unitId
}: ListNotScheduledEventsRequest): Promise<
  APIResponseType<ListNotScheduledEventsResponse>
> =>
  MOCK_API
    ? mock(listNotScheduledEventsResponseMock)
    : post(
        `${API_URL}/v1/productions/${productionId}/shootingevents/list_not_scheduled`,
        {
          unit_id: unitId
        }
      );
export default listNotScheduledEvents;
