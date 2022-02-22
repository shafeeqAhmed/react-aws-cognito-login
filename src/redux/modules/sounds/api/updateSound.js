// @flow
import { mock, post } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import env from "config/env";

const { MOCK_API, API_URL } = env;

export type UpdateSoundRequest = {
  teamId: string,
  soundId: string,
  name: string,
  description: string
};

export type UpdateSoundResponse = {
  id: string,
  version: number
};

const updateSoundResponseMock: UpdateSoundResponse = {
  id: "16q4jZz8QxQD6q3NI8W6QfIljgh",
  version: 2
};

export const updateSound = ({
  teamId,
  soundId: id,
  name,
  description
}: UpdateSoundRequest): Promise<APIResponseType<UpdateSoundResponse>> =>
  MOCK_API
    ? mock(updateSoundResponseMock)
    : post(`${API_URL}/v1/teams/${teamId}/sounds/update`, {
        id,
        name,
        description
      });

export default updateSound;
