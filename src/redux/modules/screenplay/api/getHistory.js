// @flow
import { camelize, mock, post } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import type { History } from "src/redux/modules/screenplay";
import env from "config/env";

const { MOCK_API, API_URL } = env;

type GetHistoryResponse = {
  events: Array<{
    type:
      | "Created"
      | "VersionSet"
      | "LastResolutionSet"
      | "Deleted"
      | "Restored"
      | "Removed",
    data:
      | {
          // Created
          ID: string,
          Vesrion: number,
          At: string,
          production_id: string,
          user_id: string,
          file_id: string
        }
      | {
          // VersionSet
          ID: string,
          Version: number,
          At: string,
          user_id: string,
          version_code: string
        }
      | {
          // LastResolutionSet
          ID: string,
          version: number,
          at: string,
          user_id: string,
          last_resolution: string
        }
      | {
          // Deleted
          ID: string,
          Version: number,
          At: string,
          user_id: string
        }
      | {
          // Restored
          ID: string,
          Version: number,
          At: string,
          user_id: string
        }
      | {
          // Removed
          ID: string,
          Version: number,
          At: string,
          user_id: string
        }
  }>
};

const GetHistoryResponseMock: GetHistoryResponse = {
  events: [
    {
      type: "Created",
      data: {
        ID: "149hcV38NmfjzUINKzpTQnU68VV",
        Version: 1,
        At: "2018-05-04T17:30:03.613063491-03:00",
        production_id: "8",
        user_id: "8d1f3fbb-99bf-46f0-b1dc-1b35f6a5416a",
        file_id: "149hcWYMxDhVqzD9qfcoTiULF15"
      }
    },
    {
      type: "VersionSet",
      data: {
        ID: "149hcV38NmfjzUINKzpTQnU68VV",
        Version: 2,
        At: "2018-05-04T17:30:03.683423119-03:00",
        user_id: "8d1f3fbb-99bf-46f0-b1dc-1b35f6a5416a",
        version_code: "Blue v2.543"
      }
    }
  ]
};

export type GetHistoryInput = {
  productionId: string,
  id: string
};

export type GetHistoryOutput = {
  history: History
};

/**
 * decodes the api response to `GetHistoryOutput`.
 */
async function decoder(res: GetHistoryResponse): Promise<GetHistoryOutput> {
  return { history: res.events.map(camelize) };
}

/**
 * getHistory fetches the history of a screenplay.
 * @params productionId ID of the production
 * @params id of the screenplay
 */
export default (async function getHistory({
  productionId,
  id
}: GetHistoryInput): Promise<APIResponseType<GetHistoryOutput>> {
  const response = await (MOCK_API
    ? mock(GetHistoryResponseMock)
    : post(
        `${API_URL}/v1/productions/${productionId}/screenplays/get_history`,
        { id }
      ));

  const output: APIResponseType<GetHistoryOutput> = {
    ...response,
    data: await decoder(response.data)
  };

  return output;
});
