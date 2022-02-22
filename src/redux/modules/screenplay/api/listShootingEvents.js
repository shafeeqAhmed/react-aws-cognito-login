// @flow
import { camelize, mock, post } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import type { ShootingEvent } from "src/redux/modules/screenplay";
import env from "config/env";

const { MOCK_API, API_URL } = env;

type ListShootingEventsRequest = {
  production_id: string,
  screenplay_id: string,
  limit: number,
  offset: number,
  name?: string,
  set_id?: string,
  unit_id?: string
};

type ListShootingEventsResponse = {
  shooting_events: Array<{
    id: string,
    version: number,
    production_id: string,
    screenplay_id: string,
    sequence: number,
    name: string,
    summary: string,
    scenes: Array<{
      scene_id: string,
      scene_type: string,
      scene_code: string
    }>,
    code: string,
    set_id: ?string,
    unit_id: ?string,
    location_name: ?string,
    location_latitude: ?string,
    location_longitude: ?string,
    pages: ?string,
    duration_time: ?string,
    shot_goal: ?string,
    split_count: number,
    splitted_from_id: ?string,
    split_type: ?string,
    split_index: ?number,
    merged_to_id: ?string,
    generated_from_scene_id: string,
    created_by: string,
    created_at: string,
    updated_at: string,
    deleted_at: ?string
  }>,
  limit: number,
  offset: number
};

const ListShootingEventsResponseMock: ListShootingEventsResponse = {
  shooting_events: [
    {
      id: "15vo1uiZvcEy2TmnFMtti2d4wM7",
      version: 4,
      production_id: "2",
      screenplay_id: "15vo1rRgkKEDJtj3uiNl7zQK2JA",
      sequence: 4,
      name: "Jane Martinez",
      summary: "Sam struggles with John, gets wounded then kills him dead dog.",
      scenes: [
        {
          scene_id: "15vo1t4FT5ie1vJy961oBzSLXBb",
          scene_type: "PRIMARY",
          scene_code: "2"
        },
        {
          scene_id: "15vo1pUtRYUFSZIApf2QGuQXW0Z",
          scene_type: "PRIMARY",
          scene_code: "A1"
        }
      ],
      code: "2,A1",
      set_id: "15vo1qlXWR21qy6w7NEhvOP7QMi",
      unit_id: null,
      location_name: "Kualoa Ranch House & Resort",
      location_latitude: "30.291307",
      location_longitude: "-97.755371",
      pages: "4 1/8",
      duration_time: "3:20",
      shot_goal: "8",
      split_count: 0,
      splitted_from_id: null,
      split_type: "",
      split_index: 0,
      merged_to_id: null,
      generated_from_scene_id: "15vo1t4FT5ie1vJy961oBzSLXBb",
      created_by: "50393f98-fe11-47e9-a237-8ecde9b02690",
      created_at: "2018-06-12T20:02:04Z",
      updated_at: "2018-06-12T20:02:04Z",
      deleted_at: null
    },
    {
      id: "15vo1tQ4QQk9dGVLdigKbth0UnS",
      version: 3,
      production_id: "2",
      screenplay_id: "15vo1rRgkKEDJtj3uiNl7zQK2JA",
      sequence: 21,
      name: "Mr. Dr. Raymond Day",
      summary: "Sam struggles with John, gets wounded then kills him dead dog.",
      scenes: [
        {
          scene_id: "15vo1vsWVeVzPvr7DU7HPuWhPtc",
          scene_type: "PRIMARY",
          scene_code: "1"
        }
      ],
      code: "1",
      set_id: "15vo1qXqT47q6TAjSNbsQORDpS3",
      unit_id: null,
      location_name: "Kualoa Ranch House & Resort",
      location_latitude: "30.291307",
      location_longitude: "-97.755371",
      pages: "3 1/8",
      duration_time: "4:05",
      shot_goal: "10",
      split_count: 0,
      splitted_from_id: null,
      split_type: "",
      split_index: 0,
      merged_to_id: null,
      generated_from_scene_id: "15vo1vsWVeVzPvr7DU7HPuWhPtc",
      created_by: "50393f98-fe11-47e9-a237-8ecde9b02690",
      created_at: "2018-06-12T20:02:03Z",
      updated_at: "2018-06-12T20:02:04Z",
      deleted_at: null
    }
  ],
  limit: 10,
  offset: 0
};

export type ListShootingEventsInput = {
  productionId: string,
  screenplayId: string,
  limit?: number,
  offset?: number
};

export type ListShootingEventsOutput = {
  shootingEvents: Array<ShootingEvent>,
  limit: number,
  offset: number
};

/**
 * encodes a `ListShootingEventsInput` object to an api request.
 */
async function encoder(
  input: ListShootingEventsInput
): Promise<ListShootingEventsRequest> {
  return {
    production_id: input.productionId,
    screenplay_id: input.screenplayId,
    limit: typeof input.limit === "undefined" ? 100 : input.limit,
    offset: typeof input.offset === "undefined" ? 0 : input.offset
  };
}

/**
 * decodes the api response to `ListShootingEventsOutput`.
 */
async function decoder(
  res: ListShootingEventsResponse
): Promise<ListShootingEventsOutput> {
  // eslint-disable-next-line camelcase
  const { shooting_events, ...r } = res;
  const ses: Array<ShootingEvent> = shooting_events.map(camelize);
  return { ...r, shootingEvents: ses };
}

/**
 * listShootingEvents lists the shooting events in a screenplay.
 */
export default async function listShootingEvents(
  input: ListShootingEventsInput
): Promise<APIResponseType<ListShootingEventsOutput>> {
  // eslint-disable-next-line camelcase
  const { production_id, ...req } = await encoder(input);

  const response = await (MOCK_API
    ? mock(ListShootingEventsResponseMock)
    : // eslint-disable-next-line camelcase
      post(
        // eslint-disable-next-line camelcase
        `${API_URL}/v1/productions/${production_id}/shootingevents/list`,
        req
      ));

  const output: APIResponseType<ListShootingEventsOutput> = {
    ...response,
    data: await decoder(response.data)
  };

  return output;
}
