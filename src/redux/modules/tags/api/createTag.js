// @flow
import { mock, post } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import env from "config/env";

const { MOCK_API, API_URL } = env;

export type CreateTagRequest = {
  teamId: string,
  name: string
};

export type CreateTagResponse = {
  id: string,
  version: number
};

const createTagResponseMock: CreateTagResponse = {
  id: "16q4jZz8QxQD6q3NI8W6QfIljgh",
  version: 2
};

export const createTag = ({
  teamId,
  name
}: CreateTagRequest): Promise<APIResponseType<CreateTagResponse>> =>
  MOCK_API
    ? mock(createTagResponseMock)
    : post(`${API_URL}/v1/teams/${teamId}/tags/create`, {
        name
      });

export default createTag;
