// @flow
import { mock, post } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import env from "config/env";

const { MOCK_API, API_URL } = env;

export type GetPlayUrlRequest = {
  teamId: string,
  soundId: string
};

export type GetPlayUrlResponse = {
  url: string
};

const getPlayUrlResponseMock: GetPlayUrlResponse = {
  url:
    "http://localhost:4567/procliq_lambda_test/teams/1/1IpJZPTq8kqxqLZ55Vjmy2ROnrh?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=id%2F20190322%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20190322T212100Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&response-content-disposition=inline%3B%20filename%3Djoan_welch&response-content-type=audio%2Fmpeg&X-Amz-Signature=02687a9ecc3676eb6e5c3f92d2cd41ff7830b77a6ccf4cb308a5962bd6f37445"
};

export const getPlayUrl = ({
  teamId,
  soundId: id
}: GetPlayUrlRequest): Promise<APIResponseType<GetPlayUrlResponse>> =>
  MOCK_API
    ? mock(getPlayUrlResponseMock)
    : post(`${API_URL}/v1/teams/${teamId}/sounds/get_play_url`, {
        id
      });

export default getPlayUrl;
