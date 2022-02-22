// @flow
import { mock, post } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import env from "config/env";

const { MOCK_API, API_URL } = env;

type GetUrlRequest = {
  production_id: string
};

type GetUrlResponse = {
  url: string,
  topic: string
};

const GetUrlResponseMock: GetUrlResponse = {
  url:
    "wss://test.iot.us-east-1.amazonaws.com/mqtt?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=id%2F20180618%2Fus-east-1%2Fiotdevicegateway%2Faws4_request&X-Amz-Date=20180618T194452Z&X-Amz-SignedHeaders=host&X-Amz-Signature=ce9027ae10b8d1cd414bb7e7896c61daa152e174b4a41c0c93878e7bdc121c6b&X-Amz-Security-Token=token",
  topic: "production/2"
};

export type GetUrlInput = {
  productionId: string
};

export type GetUrlOutput = {
  url: string,
  topic: string
};

async function encoder(input: GetUrlInput): Promise<GetUrlRequest> {
  return { production_id: input.productionId };
}

/**
 * decodes the api response to `GetUrlOutput`.
 */
async function decoder(res: GetUrlResponse): Promise<GetUrlOutput> {
  return res;
}

/**
 * getUrl fetches the signed websocket url to connect to the topic of a production
 * @params productionId ID of the production
 */
export default async function getUrl(
  input: GetUrlInput
): Promise<APIResponseType<GetUrlOutput>> {
  // eslint-disable-next-line camelcase
  const { production_id } = await encoder(input);

  const response = await (MOCK_API
    ? mock(GetUrlResponseMock)
    : post(
        // eslint-disable-next-line camelcase
        `${API_URL}/v1/productions/${production_id}/notifications/get_iot_url`,
        {}
      ));

  const output: APIResponseType<GetUrlOutput> = {
    ...response,
    data: await decoder(response.data)
  };

  return output;
}
