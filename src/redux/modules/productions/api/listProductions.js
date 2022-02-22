// @flow
import { get, mock } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import env from "config/env";
import type { Production } from "../";

const { MOCK_WALKIE_API, WALKIE_API_URL } = env;

type ListProductionsResponse = {
  +nextOffset: ?number,
  +items: Array<Production>
};

const ListProductionsResponseMock: ListProductionsResponse = {
  nextOffset: null,
  items: [
    {
      id: 1,
      name: "Dogs of War",
      number: "1",
      year: 1980,
      createdAt: "2018-04-26T20:57:02.936Z",
      type: null,
      team: null,
      poster: null,
      owner: {
        id: "2ee68232-f4d1-43c2-9206-7dc8771bbdb6",
        name: "John Irwin",
        mention: "jirwin",
        avatar: null
      },
      permission: "SUPER_ADMIN"
    },
    {
      id: 1,
      name: "Scent of a Woman",
      number: "2",
      year: 1992,
      createdAt: "2018-04-26T20:57:02.936Z",
      type: null,
      team: null,
      poster: null,
      owner: {
        id: "2ee68232-f4d1-43c2-9206-7dc8771bbdb6",
        name: "Martin Brest",
        mention: "mbrest",
        avatar: null
      },
      permission: "SUPER_ADMIN"
    }
  ]
};

export type ListProductionsInput = {};

export type ListProductionsOutput = {
  +nextOffset: ?number,
  +items: Array<Production>
};

async function decoder(
  res: ListProductionsResponse
): Promise<ListProductionsOutput> {
  return res;
}

/**
 * listProductions lists the productions the current user has access to.
 */
export default (async function listProductions(): Promise<
  APIResponseType<ListProductionsOutput>
> {
  const response = await (MOCK_WALKIE_API
    ? mock(ListProductionsResponseMock)
    : get(`${WALKIE_API_URL}/directory/productions`));

  const output: APIResponseType<ListProductionsOutput> = {
    ...response,
    data: await decoder(response.data)
  };

  return output;
});
