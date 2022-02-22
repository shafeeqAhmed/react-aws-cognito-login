// @flow
import { mock, post } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import env from "config/env";

const { MOCK_API, API_URL } = env;

export type CreateSoundRequest = {
  teamId: string,
  id: string,
  name: string,
  description: string
};

export type CreateSoundResponse = {
  id: string,
  version: number
};

const createSoundResponseMock: CreateSoundResponse = {
  id: "16q4jZz8QxQD6q3NI8W6QfIljgh",
  version: 2
};

export const createSound = ({
  teamId,
  id,
  name,
  description
}: CreateSoundRequest): Promise<APIResponseType<CreateSoundResponse>> =>
  MOCK_API
    ? mock(createSoundResponseMock)
    : post(`${API_URL}/v1/teams/${teamId}/sounds/create`, {
        id,
        name,
        description
      });

export default createSound;
