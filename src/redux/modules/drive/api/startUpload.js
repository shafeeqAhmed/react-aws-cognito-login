// @flow
import { mock, post, camelize } from "src/helpers/api";
import { FileTypes } from "../";
import type { APIResponseType } from "src/helpers/api";
import type { File } from "../";
import env from "config/env";

const { MOCK_API, API_URL } = env;

type StartUploadRequest = {
  production_id: string
};

type StartUploadResponse = {
  id: string,
  upload_url: string
};

const StartUploadResponseMock: StartUploadResponse = {
  id: "16q4jZz8QxQD6q3NI8W6QfIljgh",
  upload_url:
    "http://localhost:4567/procliq_lambda_test/2/17nUcerWxZYSeTAWneC9AqcJ5d6?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=id%2F20180723%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20180723T190038Z&X-Amz-Expires=300&X-Amz-SignedHeaders=host&X-Amz-Signature=8abe331b686cde587732a1551b2b2ba9f0c9e9b229883dcfd1182bd5af3459a4"
};

export type StartUploadInput = {
  productionId: number
};

export type StartUploadOutput = {
  file: File
};

/**
 * encodes a `StartUploadInput` object to an api request.
 */
async function encoder(input: StartUploadInput): Promise<StartUploadRequest> {
  return {
    production_id: `${input.productionId}`
  };
}

/**
 * decodes the api response to `StartUploadOutput`.
 */
async function decoder(
  res: StartUploadResponse,
  input: StartUploadInput
): Promise<StartUploadOutput> {
  return { file: { ...camelize(res), fileType: FileTypes.UPLOAD, ...input } };
}

/**
 * startUpload generates a new file with an uploadUrl.
 */
export default async function startUpload(
  input: StartUploadInput
): Promise<APIResponseType<StartUploadOutput>> {
  // eslint-disable-next-line camelcase
  const { production_id } = await encoder(input);

  const response = await (MOCK_API
    ? mock(StartUploadResponseMock)
    : post(
        // eslint-disable-next-line camelcase
        `${API_URL}/v1/productions/${production_id}/files/start_upload`,
        {}
      ));

  const output: APIResponseType<StartUploadOutput> = {
    ...response,
    data: await decoder(response.data, input)
  };

  return output;
}
