// @flow
import { camelize, mock, post } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import type { Download } from "../";
import env from "config/env";

const { MOCK_API, API_URL } = env;

type GetDownloadUrlRequest = {
  production_id: string,
  id: string,
  process_id?: ?number
};

type GetDownloadUrlResponse = {
  url?: string,
  process_id?: number
};

const GetDownloadUrlResponseMock: GetDownloadUrlResponse = {
  id: "19ZsbWSTC403PSmz4Im6xNXacCW",
  process_id: 0
};

export type GetDownloadUrlInput = {
  productionId: number,
  fileId: string,
  processId?: ?number
};

export type GetDownloadUrlOutput = {
  download: Download
};

async function encoder(
  input: GetDownloadUrlInput
): Promise<GetDownloadUrlRequest> {
  return {
    production_id: `${input.productionId}`,
    id: input.fileId,
    process_id: input.processId
  };
}

/**
 * decodes the api response to `GetDownloadUrlOutput`.
 */
async function decoder(
  res: GetDownloadUrlResponse
): Promise<GetDownloadUrlOutput> {
  return {
    download: { ...camelize(res) }
  };
}

/**
 * getDownloadUrl requests the url to download a file.
 * @params productionId ID of the production
 * @params id of the file
 */
export default (async function getDownloadUrl(
  input: GetDownloadUrlInput
): Promise<APIResponseType<GetDownloadUrlOutput>> {
  // eslint-disable-next-line camelcase
  const { production_id, ...req } = await encoder(input);

  const response = await (MOCK_API
    ? mock(GetDownloadUrlResponseMock)
    : post(
        // eslint-disable-next-line camelcase
        `${API_URL}/v1/productions/${production_id}/files/get_download_url`,
        req
      ));

  const output: APIResponseType<GetDownloadUrlOutput> = {
    ...response,
    data: await decoder(response.data)
  };

  return output;
});
