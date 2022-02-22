// @flow
import { mock, post } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import env from "config/env";
import { type TagType, type EntityType } from "../";

const { MOCK_API, API_URL } = env;

export type RemoveTagFromEntityRequest = {
  teamId: string,
  tagId: string,
  tagType: TagType,
  entityType: EntityType,
  entityId: string
};

export type RemoveTagFromEntityResponse = {
  id: string,
  version: number
};

const removeTagFromEntityResponseMock: RemoveTagFromEntityResponse = {
  id: "16q4jZz8QxQD6q3NI8W6QfIljgh",
  version: 3
};

export const removeTagFromEntity = ({
  teamId,
  tagId: id,
  tagType: tag_type,
  entityType: entity_type,
  entityId: entity_id
}: RemoveTagFromEntityRequest): Promise<
  APIResponseType<RemoveTagFromEntityResponse>
> =>
  MOCK_API
    ? mock(removeTagFromEntityResponseMock)
    : post(`${API_URL}/v1/teams/${teamId}/tags/delete_from_entity`, {
        id,
        tag_type,
        entity_type,
        entity_id
      });

export default removeTagFromEntity;
