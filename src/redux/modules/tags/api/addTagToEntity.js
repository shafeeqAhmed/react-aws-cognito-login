// @flow
import { mock, post } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import env from "config/env";
import { TagTypes, type TagType, type EntityType } from "../";

const { MOCK_API, API_URL } = env;

export type AddTagToEntityRequest = {
  teamId: string,
  tagId: string,
  tagType: TagType,
  entityType: EntityType,
  entityId: string,
  productionId?: string
};

export type AddTagToEntityResponse = {
  id: string,
  version: number
};

const addTagToEntityResponseMock: AddTagToEntityResponse = {
  id: "16q4jZz8QxQD6q3NI8W6QfIljgh",
  version: 2
};

export const addTagToEntity = ({
  teamId,
  tagId: id,
  tagType: tag_type = TagTypes.TAG,
  entityType: entity_type,
  entityId: entity_id,
  productionId: production_id = ""
}: AddTagToEntityRequest): Promise<APIResponseType<AddTagToEntityResponse>> =>
  MOCK_API
    ? mock(addTagToEntityResponseMock)
    : post(`${API_URL}/v1/teams/${teamId}/tags/add_to_entity`, {
        id,
        tag_type,
        entity_type,
        entity_id,
        production_id
      });

export default addTagToEntity;
