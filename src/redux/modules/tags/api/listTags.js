// @flow
import { mock, post, type APIResponseType } from "src/helpers/api";
import env from "config/env";
import { type Tag } from "../";

const { MOCK_API, API_URL } = env;

export type ListTagsRequest = {|
  teamId: string,
  limit?: number,
  offset?: number,
  name?: string,
  entityType?: string,
  entityId?: string
|};

export type ListTagsResponse = {|
  +tags: Array<Tag>,
  +limit: number,
  +offset: number
|};

const listTagsResponseMock: ListTagsResponse = {
  tags: [
    {
      id: "1IpJZleZRKvrLQeZBcjgGZPD4ie",
      version: 1,
      team_id: "1",
      name: "best price",
      entities: [],
      created_by: "50393f98-fe11-47e9-a237-8ecde9b02690",
      created_at: "2019-03-22T21:21:04Z",
      updated_at: "2019-03-22T21:21:04Z",
      deleted_at: null
    },
    {
      id: "1IpJZnr0QbeCZ1ANARcCN8zV1dC",
      version: 1,
      team_id: "1",
      name: "featured",
      entities: [],
      created_by: "50393f98-fe11-47e9-a237-8ecde9b02690",
      created_at: "2019-03-22T21:21:04Z",
      updated_at: "2019-03-22T21:21:04Z",
      deleted_at: null
    }
  ],
  limit: 10,
  offset: 0
};

export const listTags = ({
  teamId,
  limit = 100,
  offset = 0,
  name,
  entityType: entity_type,
  entityId: entity_id
}: ListTagsRequest): Promise<APIResponseType<ListTagsResponse>> =>
  MOCK_API
    ? mock(listTagsResponseMock)
    : post(`${API_URL}/v1/teams/${teamId}/tags/list`, {
        limit,
        offset,
        name,
        entity_type,
        entity_id
      });

export default listTags;
