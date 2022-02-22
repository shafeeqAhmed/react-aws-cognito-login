// @flow
import { camelize, mock, get } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import type { UserTag } from "../";
import env from "config/env";

const { MOCK_WALKIE_API, WALKIE_API_URL } = env;

type GetTagByIdRequest = {
  pid: number,
  tid: number
};

type GetTagByIdResponse = {
  id: number,
  name: string
};

const GetTagByIdResponseMock: GetTagByIdResponse = {
  id: 1,
  name: "Stunts"
};

export type GetTagByIdInput = {
  productionId: number,
  tagId: number
};

export type GetTagByIdOutput = {
  tag: UserTag
};

async function encoder(input: GetTagByIdInput): Promise<GetTagByIdRequest> {
  return {
    pid: input.productionId,
    tid: input.tagId
  };
}

async function decoder(res: GetTagByIdResponse): Promise<GetTagByIdOutput> {
  return { tag: camelize(res) };
}

/**
 * getTagById fetches information about a tag.
 */
export default async function getTagById(
  input: GetTagByIdInput
): Promise<APIResponseType<GetTagByIdOutput>> {
  const { pid, tid } = await encoder(input);

  const response = await (MOCK_WALKIE_API
    ? mock(GetTagByIdResponseMock)
    : get(`${WALKIE_API_URL}/directory/productions/${pid}/tags/${tid}`));

  const output: APIResponseType<GetTagByIdOutput> = {
    ...response,
    data: await decoder(response.data)
  };

  return output;
}
