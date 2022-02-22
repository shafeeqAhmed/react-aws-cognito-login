// @flow
import { mock, post } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import env from "config/env";

const { MOCK_WALKIE_API, WALKIE_API_URL } = env;

type NewCommentRequest = {
  production_id: string,
  comment: {
    audio: false,
    channelId: number,
    message: string
  }
};

type NewCommentResponse = {
  fromUserId: string,
  id: number,
  links: Array<{
    url: string
  }>,
  message: string,
  time: string,
  toChatId: number,
  toUserId: string
};

const NewCommentResponseMock: NewCommentResponse = {
  fromUserId: "string",
  id: 0,
  links: [
    {
      url: "string"
    }
  ],
  message: "string",
  time: "2018-09-24T16:27:20.276Z",
  toChatId: 0,
  toUserId: "string"
};

export type NewCommentInput = {
  productionId: number,
  channelId: number,
  message: string
};

export type NewCommentOutput = {
  message: {
    fromUserId: string,
    id: number,
    links: Array<{
      url: string
    }>,
    message: string,
    time: string,
    toChatId: number,
    toUserId: string
  }
};

async function encoder(input: NewCommentInput): Promise<NewCommentRequest> {
  return {
    production_id: `${input.productionId}`,
    comment: {
      audio: false,
      channelId: input.channelId,
      message: input.message
    }
  };
}

async function decoder(
  res: NewCommentResponse,
  input: NewCommentInput
): Promise<NewCommentOutput> {
  return { message: res };
}

export default async function newComment(
  input: NewCommentInput
): Promise<APIResponseType<NewCommentOutput>> {
  // eslint-disable-next-line camelcase
  const { production_id, comment } = await encoder(input);

  const response = await (MOCK_WALKIE_API
    ? mock(NewCommentResponseMock)
    : // eslint-disable-next-line camelcase
      post(`${WALKIE_API_URL}/walkie/productions/${production_id}/messages`, {
        ...comment,
        userId: null
      }));

  const output: APIResponseType<NewCommentOutput> = {
    ...response,
    data: await decoder(response.data, input)
  };

  return output;
}
