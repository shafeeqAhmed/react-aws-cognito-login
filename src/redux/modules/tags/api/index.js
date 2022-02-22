// @flow

export { default as listTags } from "./listTags";
export type { ListTagsRequest, ListTagsResponse } from "./listTags";

export { default as createTag } from "./createTag";
export type { CreateTagRequest, CreateTagResponse } from "./createTag";

export { default as addTagToEntity } from "./addTagToEntity";
export type {
  AddTagToEntityRequest,
  AddTagToEntityResponse
} from "./addTagToEntity";

export { default as removeTagFromEntity } from "./removeTagFromEntity";
export type {
  RemoveTagFromEntityRequest,
  RemoveTagFromEntityResponse
} from "./removeTagFromEntity";
