// @flow
import { mock, post } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import env from "config/env";

const { MOCK_API, API_URL } = env;

export type StartUploadRequest = {
  teamId: string
};

export type StartUploadResponse = {
  id: string,
  upload_url: string
};

const startUploadResponseMock: StartUploadResponse = {
  id: "16q4jZz8QxQD6q3NI8W6QfIljgh",
  upload_url:
    "http://localhost:4567/procliq_lambda_test/2/17nUcerWxZYSeTAWneC9AqcJ5d6?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=id%2F20180723%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20180723T190038Z&X-Amz-Expires=300&X-Amz-SignedHeaders=host&X-Amz-Signature=8abe331b686cde587732a1551b2b2ba9f0c9e9b229883dcfd1182bd5af3459a4"
};

export const startUpload = ({
  teamId
}: StartUploadRequest): Promise<APIResponseType<StartUploadResponse>> => {
  if (MOCK_API) {
    return mock(startUploadResponseMock);
  }

  return post(`${API_URL}/v1/teams/${teamId}/sounds/start_upload`, {});
};

export default startUpload;
