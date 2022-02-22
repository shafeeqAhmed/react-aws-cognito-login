// @flow
import { mock, post } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import env from "config/env";

const { MOCK_API, API_URL } = env;

export type EndUploadRequest = {|
  +teamId: string,
  +id: string,
  +name: string,
  +fileName: string,
  +description: string
|};

export type EndUploadResponse = {|
  +id: string,
  +version: number
|};

const endUploadResponseMock: EndUploadResponse = {
  id: "16q4jZz8QxQD6q3NI8W6QfIljgh",
  version: 2
};

export const endUpload = ({
  teamId,
  id,
  name,
  fileName: file_name,
  description
}: EndUploadRequest): Promise<APIResponseType<EndUploadResponse>> =>
  MOCK_API
    ? mock(endUploadResponseMock)
    : post(`${API_URL}/v1/teams/${teamId}/sounds/end_upload`, {
        id,
        name,
        file_name,
        description
      });

export default endUpload;
