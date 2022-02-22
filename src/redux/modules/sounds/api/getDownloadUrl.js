// @flow
import { mock, post } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import env from "config/env";

const { MOCK_API, API_URL } = env;

export type GetDownloadUrlRequest = {
  teamId: string,
  soundIds: Array<string>,
  processId?: string
};

export type GetDownloadUrlResponse = {
  url?: string,
  process_id?: number
};

const getDownloadUrlResponseMock: GetDownloadUrlResponse = {
  url: "https://google.com"
};

export const getDownloadUrl = ({
  teamId,
  soundIds: ids,
  processId: process_id
}: GetDownloadUrlRequest): Promise<APIResponseType<GetDownloadUrlResponse>> =>
  MOCK_API
    ? mock(getDownloadUrlResponseMock)
    : post(`${API_URL}/v1/teams/${teamId}/sounds/get_download_url`, {
        ids,
        process_id
      });

export default getDownloadUrl;
