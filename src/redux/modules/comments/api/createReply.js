// @flow
import { mock, post } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import env from "config/env";
import { type Comment } from "src/redux/modules/comments";

const { MOCK_WALKIE_API, WALKIE_API_URL } = env;

type CreateReplyRequest = {
  pid: number,
  channelId: number,
  threadId: number,
  message: string,
  audio: false,
  userId: null
};

type CreateReplyResponse = {
  +id: number,
  +fromUserId: string,
  +message: string,
  +time: string,
  +toChatId: number
};

const CreateReplyResponseMock: CreateReplyResponse = {
  id: 0,
  fromUserId: "string",
  toChatId: 5,
  time: "2018-09-24T16:27:20.276Z",
  message: "this is a reply"
};

export type CreateReplyInput = {
  productionId: number,
  threadId: number,
  channelId: number,
  message: string
};

export type CreateReplyOutput = {
  +reply: $Shape<{ ...Comment }>
};

async function encoder(input: CreateReplyInput): Promise<CreateReplyRequest> {
  return {
    pid: input.productionId,
    channelId: input.channelId,
    threadId: input.threadId,
    message: input.message,
    audio: false,
    userId: null
  };
}

async function decoder(
  res: CreateReplyResponse,
  input: CreateReplyInput
): Promise<CreateReplyOutput> {
  const reply = { ...res };
  return { reply };
}

export default async function createReply(
  input: CreateReplyInput
): Promise<APIResponseType<CreateReplyOutput>> {
  const { pid, ...req } = await encoder(input);

  const response = await (MOCK_WALKIE_API
    ? mock(CreateReplyResponseMock)
    : post(`${WALKIE_API_URL}/walkie/productions/${pid}/messages`, req));

  const output: APIResponseType<CreateReplyOutput> = {
    ...response,
    data: await decoder(response.data, input)
  };

  return output;
}
