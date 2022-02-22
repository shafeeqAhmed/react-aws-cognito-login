// @flow
import { mock, post } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import type { Sound } from "../";
import env from "config/env";

const { MOCK_API, API_URL } = env;

export type GetMetadataRequest = {
  teamId: string,
  soundId: string
};

export type GetMetadataResponse = {
  sound: Sound
};

const getMetadataResponseMock: GetMetadataResponse = {
  sound: {
    id: "1IpJZRyYc33Wu5Mmpwv0pCuuxYI",
    version: 1,
    team_id: "1",
    team_order: 1,
    name: "High Heels Walking",
    description: "Davis Car Mart",
    duration: "",
    productions: [],
    created_by: "50393f98-fe11-47e9-a237-8ecde9b02690",
    created_at: "2019-03-22T21:21:00Z",
    updated_at: "2019-03-22T21:21:00Z",
    deleted_at: null
  }
};

export const getMetadata = ({
  teamId,
  soundId: id
}: GetMetadataRequest): Promise<APIResponseType<GetMetadataResponse>> =>
  MOCK_API
    ? mock(getMetadataResponseMock)
    : post(`${API_URL}/v1/teams/${teamId}/sounds/get_metadata`, {
        id
      });

export default getMetadata;
