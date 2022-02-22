// @flow
import { type APIResponseType, mock, get } from "src/helpers/api";
import { get as getProperty } from "lodash";
import type { Comment } from "../";
import env from "config/env";

const { MOCK_API, WALKIE_API_URL } = env;

type ListCommentsRequest = {
  pid: number,
  channel: number,
  thread?: ?number
};

type ListCommentsResponse = {
  items: Array<Comment>,
  nextOffset: number
};

const ListCommentsResponseMock: ListCommentsResponse = {
  items: [
    {
      id: 4166,
      fromUserId: "bdb4f01a-cd0e-4626-b22b-52c429bf01d5",
      message:
        "Do we know yet if we have clearance on the specific brand of beer we were talking about the other day?",
      time: "2018-09-24T16:48:41.748Z",
      toChatId: 5,
      thread: {
        replies: 0,
        status: "OPENED",
        topics: []
      }
    }
  ],
  nextOffset: 0
};

export type ListCommentsInput = {
  productionId: number,
  channelId: number,
  threadId?: ?number
};

export type ListCommentsOutput = {
  comments: Array<Comment>
};

/**
 * encodes a `ListCommentsInput` object to an api request.
 */
async function encoder(input: ListCommentsInput): Promise<ListCommentsRequest> {
  return {
    pid: input.productionId,
    channel: input.channelId,
    thread: input.threadId
  };
}

/**
 * decodes the api response to `ListCommentsOutput`.
 */
async function decoder(res: ListCommentsResponse): Promise<ListCommentsOutput> {
  return { comments: res.items };
}

type Page = { output: ListCommentsOutput, nextOffset: ?number };

/**
 * getComments returns a paginated list of files at the root of the drive or a subfolder.
 */
export default async function listComments(
  input: ListCommentsInput
): Promise<APIResponseType<ListCommentsOutput>> {
  let output: ListCommentsOutput = {
    comments: []
  };

  let nextOffset = -1;

  while (nextOffset) {
    let page: ?Page;

    try {
      // eslint-disable-next-line no-await-in-loop
      page = await paginate(input, Math.max(nextOffset, 0));
    } catch (e) {
      if (output.comments.length) {
        // return partial results
        break;
      } else {
        // return error
        throw e;
      }
    }

    if (!page) break;

    output = {
      ...output,
      comments: [...output.comments, ...page.output.comments]
    };

    nextOffset = page.nextOffset;
  }

  return {
    statusCode: 200,
    data: output
  };
}

async function paginate(
  input: ListCommentsInput,
  offset?: number
): Promise<Page> {
  const { pid, channel, thread } = await encoder(input);

  // eslint-disable-next-line no-undef
  const url = new URL(`${WALKIE_API_URL}/walkie/productions/${pid}/messages`);
  if (channel) url.searchParams.append("channel", `${channel}`);
  if (thread) url.searchParams.append("thread", `${thread}`);
  if (offset) url.searchParams.append("offset", `${offset}`);

  const response = await (MOCK_API
    ? mock(ListCommentsResponseMock)
    : get(url.toString()));

  const output = await decoder(response.data);
  const nextOffset = getProperty(response, "data.nextOffset", null);

  return { output, nextOffset };
}
