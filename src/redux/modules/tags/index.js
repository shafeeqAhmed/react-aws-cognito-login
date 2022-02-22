// @flow
import { findIndex, get } from "lodash";
import { upsert } from "src/helpers/lodash";
import ksuid from "ksuid";
import * as api from "./api";

export * from "./selectors";

export const FETCH_TAGS: "procliq-web-editor/tags/FETCH_TAGS" =
  "procliq-web-editor/tags/FETCH_TAGS";

export const SEARCH_TAGS: "procliq-web-editor/tags/SEARCH_TAGS" =
  "procliq-web-editor/tags/SEARCH_TAGS";

export const CREATE_TAG: "procliq-web-editor/tags/CREATE_TAG" =
  "procliq-web-editor/tags/CREATE_TAG";

export const ADD_TAG_TO_ENTITY: "procliq-web-editor/tags/ADD_TAG_TO_ENTITY" =
  "procliq-web-editor/tags/ADD_TAG_TO_ENTITY";

export const REMOVE_TAG_FROM_ENTITY: "procliq-web-editor/tags/REMOVE_TAG_FROM_ENTITY" =
  "procliq-web-editor/tags/REMOVE_TAG_FROM_ENTITY";

export const TagTypes = {
  TAG: ("tag": "tag"),
  PRODUCTION_GROUP: ("production_group": "production_group")
};

export type TagType = $Values<typeof TagTypes>;

export const EntityTypes = {
  ELEMENT: ("element": "element"),
  LOCATION: ("location": "location"),
  VENDOR: ("vendor": "vendor"),
  SOUND: ("sound": "sound")
};

export type EntityType = $Values<typeof EntityTypes>;

export type TagEntity = {|
  +tag_id: string,
  +tag_type: TagType,
  +entity_type: EntityType,
  +entity_id: string,
  +production_id: ?string
|};

export type Tag = {|
  +id: string,
  +version: number,
  +team_id: string,
  +name: string,
  +entities: Array<TagEntity>,
  +created_by: string,
  +created_at: string,
  +updated_at: string,
  +deleted_at: ?string
|};

export type SearchQuery = {|
  +term: string
|};

export type Search = {|
  +query: SearchQuery,
  +results: Array<string>,
  +select?: Array<Tag>
|};

export type State = {|
  +list: Array<Tag>,
  +search: Search,
  +isFetching: boolean,
  +error: ?string
|};

const initialState = {
  list: [],
  search: {
    query: { term: "" },
    results: []
  },
  isFetching: false,
  error: ""
};

export default function reducer(
  state: State = initialState,
  action: GlobalFSA<*>
): State {
  switch (action.type) {
    case `${FETCH_TAGS}_PENDING`:
      return {
        ...state,
        isFetching: true
      };

    case `${FETCH_TAGS}_FULFILLED`: {
      const tags = get(action, "payload.data.tags", []);
      const list = tags.reduce(
        (l, i) => upsert(l, i, tag => tag.id === i.id),
        []
      );

      return {
        ...state,
        list,
        isFetching: false,
        error: null
      };
    }

    case `${FETCH_TAGS}_REJECTED`:
      return {
        ...state,
        isFetching: false,
        error: action.payload
      };

    case `${SEARCH_TAGS}_PENDING`:
      return {
        ...state,
        isFetching: true,
        search: {
          ...state.search,
          query: { term: get(action, "meta.request.name", "") }
        }
      };

    case `${SEARCH_TAGS}_FULFILLED`: {
      const tags = get(action, "payload.data.tags", []);
      const list = tags.reduce(
        (l, i) => upsert(l, i, sound => sound.id === i.id),
        []
      );

      // update search results if query hasn't changed.
      const results =
        state.search.query.term === get(action, "meta.request.name", "")
          ? tags.map(s => s.id)
          : state.search.results;

      return {
        ...state,
        list,
        search: {
          ...state.search,
          results
        },
        isFetching: false,
        error: null
      };
    }

    case `${SEARCH_TAGS}_REJECTED`:
      return {
        ...state,
        isFetching: false,
        error: action.payload
      };

    case `${CREATE_TAG}_PENDING`: {
      const request: api.CreateTagRequest = get(action, "meta.request", {});
      const now = new Date().toISOString();
      const id: string = get(action, "meta.id");
      if (!id) return state;

      const tag: Tag = {
        id,
        version: 0,
        team_id: get(request, "teamId", ""),
        name: get(request, "name", ""),
        entities: [],
        created_by: "",
        created_at: now,
        updated_at: now,
        deleted_at: undefined
      };

      const list = upsert(state.list, tag, t => t.id === tag.id);

      return {
        ...state,
        list,
        isFetching: true
      };
    }

    case `${CREATE_TAG}_FULFILLED`: {
      const request = get(action, "meta.request", {});
      const response: api.CreateTagResponse = get(action, "payload.data", {});

      const now = new Date().toISOString();
      const id = get(action, "meta.id");

      const list = state.list.slice();
      const index = findIndex(list, t => t.id === id);

      if (!id || index === -1) {
        // insert
        list.push({
          id,
          version: 0,
          team_id: get(request, "teamId", ""),
          name: get(request, "name", ""),
          entities: [],
          created_by: "",
          created_at: now,
          updated_at: now,
          deleted_at: undefined
        });
      } else {
        // replace
        list.splice(index, 1, {
          ...list[index],
          ...response
        });
      }

      return {
        ...state,
        list,
        isFetching: false
      };
    }

    case `${CREATE_TAG}_REJECTED`: {
      const list = state.list.slice();
      const id = get(action, "meta.id");
      const index = findIndex(list, t => t.id === id);

      if (index !== -1) {
        list.splice(index, 1);
      }

      return {
        ...state,
        list,
        isFetching: false,
        error: action.payload
      };
    }

    case `${ADD_TAG_TO_ENTITY}_PENDING`: {
      const request: api.AddTagToEntityRequest = get(
        action,
        "meta.request",
        {}
      );
      const now = new Date().toISOString();
      const list = state.list.slice();

      const index = findIndex(list, t => t.id === request.tagId);
      if (index === -1) return state;

      const entities = upsert(
        list[index].entities,
        {
          tag_id: request.tagId,
          tag_type: request.tagType,
          entity_type: request.entityType,
          entity_id: request.entityId,
          production_id: request.productionId
        },
        e =>
          e.entity_type === request.entityType &&
          e.entity_id === request.entityId
      );

      list.splice(index, 1, {
        ...list[index],
        entities,
        updated_at: now
      });

      return {
        ...state,
        list
      };
    }

    case `${ADD_TAG_TO_ENTITY}_FULFILLED`:
      return state;

    case `${ADD_TAG_TO_ENTITY}_REJECTED`: {
      const request: api.AddTagToEntityRequest = get(
        action,
        "meta.request",
        {}
      );
      const list = state.list.slice();

      const index = findIndex(list, t => t.id === request.tagId);
      if (index === -1)
        return {
          ...state,
          error: action.payload
        };

      const entities = list[index].entities.slice();
      const entityIndex = findIndex(
        entities,
        e =>
          e.entity_type === request.entityType &&
          e.entity_id === request.entityId
      );
      if (!entityIndex === -1)
        return {
          ...state,
          error: action.payload
        };

      entities.splice(entityIndex, 1);
      list.splice(index, 1, {
        ...list[index],
        entities
      });

      return {
        ...state,
        list,
        error: action.payload
      };
    }

    case `${REMOVE_TAG_FROM_ENTITY}_PENDING`: {
      const request: api.RemoveTagFromEntityRequest = get(
        action,
        "meta.request",
        {}
      );
      const list = state.list.slice();

      const index = findIndex(list, t => t.id === request.tagId);
      if (index === -1) return state;

      const entities = list[index].entities.slice();
      const entityIndex = findIndex(
        entities,
        e =>
          e.entity_type === request.entityType &&
          e.entity_id === request.entityId
      );
      if (!entityIndex === -1) return state;

      entities.splice(entityIndex, 1);
      list.splice(index, 1, {
        ...list[index],
        entities
      });

      return {
        ...state,
        list
      };
    }

    case `${REMOVE_TAG_FROM_ENTITY}_FULFILLED`: {
      return state;
    }

    case `${REMOVE_TAG_FROM_ENTITY}_REJECTED`: {
      // TODO: refetch tag from api
      return {
        ...state,
        error: action.payload
      };
    }

    default:
      return state;
  }
}

export const fetchTags = (request: api.ListTagsRequest) => ({
  type: FETCH_TAGS,
  payload: api.listTags(request)
});

export const createTag = (request: api.CreateTagRequest) => ({
  type: CREATE_TAG,
  payload: api.createTag(request),
  meta: {
    request,
    id: ksuid.randomSync().string
  }
});

export const searchTags = (request: api.ListTagsRequest) => ({
  type: SEARCH_TAGS,
  payload: api.listTags(request),
  meta: { request }
});

export const addTagToEntity = (request: api.AddTagToEntityRequest) => ({
  type: ADD_TAG_TO_ENTITY,
  payload: api.addTagToEntity(request),
  meta: { request }
});

export const removeTagFromEntity = (
  request: api.RemoveTagFromEntityRequest
) => ({
  type: REMOVE_TAG_FROM_ENTITY,
  payload: api.removeTagFromEntity(request),
  meta: { request }
});
