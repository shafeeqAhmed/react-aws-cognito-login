// @flow
import { mock, post } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import env from "config/env";
import { type Channel } from "src/redux/modules/comments";

const { MOCK_WALKIE_API, WALKIE_API_URL } = env;

type GetChannelRequest = {
  productionId: number,
  type: "SCREENPLAY",
  id: string
};

type GetChannelResponse = {
  id: number
};

const GetChannelResponseMock: GetChannelResponse = {
  id: 1
};

export type GetChannelInput = {
  productionId: number,
  screenplayId: string
};

export type GetChannelOutput = {
  channel: Channel
};

async function encoder(input: GetChannelInput): Promise<GetChannelRequest> {
  return {
    productionId: input.productionId,
    type: "SCREENPLAY",
    id: input.screenplayId
  };
}

async function decoder(
  res: GetChannelResponse,
  input: GetChannelInput
): Promise<GetChannelOutput> {
  return { channel: { id: res.id } };
}

export default async function getChannel(
  input: GetChannelInput
): Promise<APIResponseType<GetChannelOutput>> {
  const { productionId, ...body } = await encoder(input);

  const response = await (MOCK_WALKIE_API
    ? mock(GetChannelResponseMock)
    : post(
        `${WALKIE_API_URL}/walkie/productions/${productionId}/channels/attached`,
        body
      ));

  const output: APIResponseType<GetChannelOutput> = {
    ...response,
    data: await decoder(response.data, input)
  };

  return output;
}
