// @flow
import { mock, post, type APIResponseType } from "src/helpers/api";
import env from "config/env";
import { type Sound } from "../";

const { MOCK_API, API_URL } = env;

export type ListSoundsRequest = {|
  teamId: string,
  limit?: number,
  offset?: number,
  name?: string,
  productionId?: string
|};

export type ListSoundsResponse = {|
  +sounds: Array<Sound>,
  +limit: number,
  +offset: number
|};

const listSoundsResponseMock: ListSoundsResponse = {
  sounds: [
    {
      id: "1IpJZPWqHkQfCqPt98jigzva3A2",
      version: 1,
      team_id: "1",
      team_order: 1,
      name: "High Heels Walking",
      description: "",
      duration: "",
      productions: [],
      created_by: "50393f98-fe11-47e9-a237-8ecde9b02690",
      created_at: "2019-03-22T21:21:01Z",
      updated_at: "2019-03-22T21:21:01Z",
      deleted_at: null
    },
    {
      id: "1IpJZL1Jq5iJS9zYGLhKQ8eg4fS",
      version: 1,
      team_id: "1",
      team_order: 2,
      name: "Whoosh",
      description: "",
      duration: "",
      productions: [],
      created_by: "50393f98-fe11-47e9-a237-8ecde9b02690",
      created_at: "2019-03-22T21:21:01Z",
      updated_at: "2019-03-22T21:21:01Z",
      deleted_at: null
    }
  ],
  limit: 10,
  offset: 0
};

export const listSounds = ({
  teamId,
  limit = 100,
  offset = 0,
  name,
  productionId
}: ListSoundsRequest): Promise<APIResponseType<ListSoundsResponse>> =>
  MOCK_API
    ? mock(listSoundsResponseMock)
    : post(`${API_URL}/v1/teams/${teamId}/sounds/list`, {
        limit,
        offset,
        name,
        productionId
      });

export default listSounds;
