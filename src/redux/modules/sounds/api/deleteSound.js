// @flow
import { mock, post } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import env from "config/env";

const { MOCK_API, API_URL } = env;

export type DeleteSoundRequest = {
  teamId: string,
  soundId: string
};

export type DeleteSoundResponse = {
  id: string,
  version: number
};

const deleteSoundResponseMock: DeleteSoundResponse = {
  id: "16q4jZz8QxQD6q3NI8W6QfIljgh",
  version: 2
};

export const deleteSound = ({
  teamId,
  soundId: id
}: DeleteSoundRequest): Promise<APIResponseType<DeleteSoundResponse>> =>
  MOCK_API
    ? mock(deleteSoundResponseMock)
    : post(`${API_URL}/v1/teams/${teamId}/sounds/delete`, {
        id
      });

export default deleteSound;
