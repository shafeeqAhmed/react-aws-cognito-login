// @flow
import { get, mock } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import env from "config/env";
import type { Team } from "../";

const { MOCK_WALKIE_API, WALKIE_API_URL } = env;

export type ListTeamsRequest = {|
  +limit?: number,
  +offset?: number,
  +name?: string
|};

export type ListTeamsResponse = {|
  +nextOffset?: ?number,
  +totalItems?: ?number,
  +items: Array<Team>
|};

const listTeamsResponseMock: ListTeamsResponse = {
  items: [
    {
      id: 1,
      name: "team A",
      role: "string"
    }
  ],
  nextOffset: 1,
  totalItems: 1
};

export const listTeams = ({
  name,
  limit = 100,
  offset = 0
}: ListTeamsRequest): Promise<APIResponseType<ListTeamsResponse>> =>
  MOCK_WALKIE_API
    ? mock(listTeamsResponseMock)
    : get(`${WALKIE_API_URL}/directory/teams`, {
        limit,
        offset,
        name
      });

export default listTeams;
