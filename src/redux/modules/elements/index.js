// @flow
import { findIndex, defaults, get, isEqual } from "lodash";
import ksuid from "ksuid";
import { upsert } from "src/helpers/lodash";
import * as api from "./api";
import { type ShootingEvent, type Set } from "../shooting/events";
import { type TagType } from "../tags";

// export * from './selectors';

export const FETCH_ELEMENTS: "procliq-web-editor/elements/FETCH_ELEMENTS" =
  "procliq-web-editor/elements/FETCH_ELEMENTS";

export const FETCH_ELEMENT: "procliq-web-editor/elements/FETCH_ELEMENT" =
  "procliq-web-editor/elements/FETCH_ELEMENT";

export const DELETE_ELEMENT: "procliq-web-editor/elements/DELETE_ELEMENT" =
  "procliq-web-editor/elements/DELETE_ELEMENT";

export const CREATE_ELEMENT: "procliq-web-editor/elements/CREATE_ELEMENT" =
  "procliq-web-editor/elements/CREATE_ELEMENT";

export const UPDATE_ELEMENT: "procliq-web-editor/elements/UPDATE_ELEMENT" =
  "procliq-web-editor/elements/UPDATE_ELEMENT";

export const ADD_ITEM_TO_ELEMENT: "procliq-web-editor/elements/ADD_ITEM_TO_ELEMENT" =
  "procliq-web-editor/elements/ADD_ITEM_TO_ELEMENT";

export const REMOVE_ITEM_FROM_ELEMENT: "procliq-web-editor/elements/REMOVE_ITEM_FROM_ELEMENT" =
  "procliq-web-editor/elements/REMOVE_ITEM_FROM_ELEMENT";

export const SYNC_ANCHORS: "procliq-web-editor/elements/SYNC_ANCHORS" =
  "procliq-web-editor/elements/SYNC_ANCHORS";

export const SYNC_ANCHOR_ADDED: "procliq-web-editor/elements/SYNC_ANCHOR_ADDED" =
  "procliq-web-editor/elements/SYNC_ANCHOR_ADDED";

export const SYNC_ANCHOR_REMOVED: "procliq-web-editor/elements/SYNC_ANCHOR_REMOVED" =
  "procliq-web-editor/elements/SYNC_ANCHOR_REMOVED";

export const SYNC_ANCHORS_REMOVED: "procliq-web-editor/elements/SYNC_ANCHORS_REMOVED" =
  "procliq-web-editor/elements/SYNC_ANCHORS_REMOVED";

export const SEARCH_ELEMENTS: "procliq-web-editor/elements/SEARCH_ELEMENTS" =
  "procliq-web-editor/elements/SEARCH_ELEMENTS";

export const LINK_TO_SHOOTING_EVENT: "procliq-web-editor/elements/LINK_TO_SHOOTING_EVENT" =
  "procliq-web-editor/elements/LINK_TO_SHOOTING_EVENT";

export const UNLINK_FROM_SHOOTING_EVENT: "procliq-web-editor/elements/UNLINK_FROM_SHOOTING_EVENT" =
  "procliq-web-editor/elements/UNLINK_FROM_SHOOTING_EVENT";

export const ELEMENT_INSERTED = ("procliq-web-editor/elements/FILE_INSERTED": "procliq-web-editor/elements/FILE_INSERTED");
export const ELEMENT_MODIFIED = ("procliq-web-editor/elements/FILE_MODIFIED": "procliq-web-editor/elements/FILE_MODIFIED");
export const ELEMENT_REMOVED = ("procliq-web-editor/elements/FILE_REMOVED": "procliq-web-editor/elements/FILE_REMOVED");

type ElementScenes = {|
  +shootingevent_id: $PropertyType<ShootingEvent, "id">,
  +scene_id?: string,
  +shootingevent_name?: $PropertyType<ShootingEvent, "name">,
  +set_id?: $PropertyType<Set, "id">,
  +set_name?: $PropertyType<Set, "name">,
  +screenplay_id: $PropertyType<ShootingEvent, "screenplay_id">,
  +scene_title?: string,
  +scene_sequence?: number,
  +scene_code?: ?string
|};

export const ItemStatuses = {
  READY: ("ready": "ready"),
  NOT_READY: ("not_ready": "not_ready"),
  ORDERED: ("ordered": "ordered")
};

export type ItemStatus = $Values<typeof ItemStatuses>;

export const ItemAquisitionTypes = {
  LEASE: ("lease": "lease"),
  PURCHASE: ("purchase": "purchase"),
  PURCHASE_BULK: ("purchase_bulk": "purchase_bulk"),
  RENTAL: ("rental": "rental"),
  BUILD: ("build": "build"),
  BUILD_BULK: ("buildbulk": "buildbulk")
};

export type ItemAquisitionType = $Values<typeof ItemAquisitionTypes>;

export type ElementShootingEvent = {|
  +quantity: ?number,
  +screenplay_id?: string,
  +set_id?: string,
  +set_name?: string,
  +shootingevent_id: string,
  +shootingevent_name?: string
|};

export const ElementItemTypes = {
  ITEM: ("item": "item"),
  SOUND: ("sound": "sound")
};

export type ElementItemType = $Values<typeof ElementItemTypes>;

export type ElementItem = {|
  +element_id: string,
  +item_id: string,
  +item_type: ElementItemType
|};

export type RelatedObject = {|
  +id: string,
  +__typename?: "related",
  +name: string
|};

export type ElementTag = {|
  +tag_id: string,
  +tag_name: string,
  +tag_type: TagType
|};

export type Element = {|
  +id: string,
  +version: number,
  +__typename?: "element",
  +production_id: string,
  +name: string,
  +category_id: string,
  +category_name: ?string,
  +category_order: ?number,
  +category_type: ?string,
  +display_id: ?string,
  +image_id: ?string,
  +image_url: ?string,
  +items?: ?Array<ElementItem>,
  +max_quantity: ?number,
  +related_id: string,
  +shootingevents: Array<ElementShootingEvent>,
  +shootingevents_scenes: Array<ElementScenes>,
  +tags: ?Array<ElementTag>,
  +created_by: string,
  +created_at: string,
  +updated_at: string,
  +deleted_at: ?string
|};

export type Search = {|
  +request: $Shape<{ ...api.ListElementsRequest }>,
  +list: Array<Element>,
  +related: Array<RelatedObject>,
  +isFetching: boolean,
  +error: ?string
|};

export type State = {|
  +isFetching: boolean,
  +list: Array<Element>,
  +search: Search,
  +error: ?string
|};

const initialState = {
  isFetching: false,
  list: [],
  search: {
    request: {},
    list: [],
    related: [],
    isFetching: false,
    error: ""
  },
  error: ""
};

export default function reducer(
  state: State = initialState,
  action: GlobalFSA<*>
): State {
  switch (action.type) {
    case `${FETCH_ELEMENTS}_PENDING`:
      return {
        ...state,
        isFetching: true
      };

    case `${FETCH_ELEMENTS}_FULFILLED`: {
      const elementsFromApi: $PropertyType<
        api.ListElementsResponse,
        "elements"
      > = get(action, "payload.data.elements", []);

      const elements = elementsFromApi.reduce(
        (list, element) => upsert(list, element, e => e.id === element.id),
        state.list.slice()
      );

      return {
        ...state,
        error: initialState.error,
        isFetching: false,
        list: elements
      };
    }

    case `${FETCH_ELEMENTS}_REJECTED`:
      return {
        ...state,
        isFetching: false,
        error: action.payload
      };

    case `${FETCH_ELEMENT}_PENDING`:
      return {
        ...state,
        isFetching: true
      };

    case `${FETCH_ELEMENT}_FULFILLED`: {
      const element: $PropertyType<api.GetMetadataResponse, "element"> = get(
        action,
        "payload.data.element",
        {}
      );

      const list = upsert(state.list, element, e => e.id === element.id);

      return {
        ...state,
        error: initialState.error,
        isFetching: false,
        list
      };
    }

    case `${FETCH_ELEMENT}_REJECTED`:
      return {
        ...state,
        isFetching: false,
        error: action.payload
      };

    case `${DELETE_ELEMENT}_PENDING`: {
      const list = [...state.list];
      const request: api.DeleteElementRequest = get(action, "meta.request", {});
      const now = new Date().toISOString();

      const index = findIndex(list, e => e.id === request.elementId);
      if (index === -1) return state;

      list.splice(index, 1, {
        ...list[index],
        deleted_at: now
      });

      return {
        ...state,
        list
      };
    }

    case `${DELETE_ELEMENT}_FULFILLED`: {
      const list = [...state.list];
      const request: api.DeleteElementRequest = get(action, "meta.request", {});
      const now = new Date().toISOString();

      const index = findIndex(list, e => e.id === request.elementId);
      if (index === -1) return state;

      list.splice(index, 1, {
        ...list[index],
        deleted_at: list[index].deleted_at || now
      });

      return {
        ...state,
        list
      };
    }

    case `${DELETE_ELEMENT}_REJECTED`: {
      const list = [...state.list];
      const request: api.DeleteElementRequest = get(action, "meta.request", {});

      const index = findIndex(list, e => e.id === request.elementId);
      if (index === -1) return state;

      list.splice(index, 1, {
        ...list[index],
        deleted_at: null
      });

      return {
        ...state,
        list,
        error: action.payload
      };
    }

    case `${CREATE_ELEMENT}_PENDING`: {
      const list = [...state.list];
      const request: api.CreateElementRequest = get(action, "meta.request", {});
      const now = new Date().toISOString();
      const id = get(action, "meta.id");
      if (!id) return state;

      const element: Element = {
        id,
        version: 0,
        production_id: get(request, "productionId", ""),
        name: get(request, "name", ""),
        category_id: get(request, "categoryId", ""),
        category_name: get(request, "categoryName", ""),
        category_order: get(request, "categoryOrder", ""),
        category_type: get(request, "categoryType", ""),
        display_id: get(request, "displayId", ""),
        image_id: get(request, "imageId", ""),
        image_url: get(request, "imageUrl", ""),
        max_quantity: get(request, "maxQuantity", ""),
        related_id: get(request, "relatedId", ""),
        shootingevents: [],
        shootingevents_scenes: [],
        tags: [],
        created_by: "",
        created_at: now,
        updated_at: now,
        deleted_at: null
      };

      list.push(element);

      return {
        ...state,
        list,
        isFetching: true
      };
    }

    case `${CREATE_ELEMENT}_FULFILLED`: {
      const request: api.CreateElementRequest = get(action, "meta.request", {});
      const response: api.CreateElementResponse = get(
        action,
        "payload.data",
        {}
      );

      const now = new Date().toISOString();
      const id = get(action, "meta.id");

      const element: Element = {
        id,
        version: 0,
        production_id: get(request, "productionId", ""),
        name: get(request, "name", ""),
        category_id: get(request, "categoryId", ""),
        category_name: get(request, "categoryName", ""),
        category_order: get(request, "categoryOrder", ""),
        category_type: get(request, "categoryType", ""),
        display_id: get(request, "displayId", ""),
        image_id: get(request, "imageId", ""),
        image_url: get(request, "imageUrl", ""),
        max_quantity: get(request, "maxQuantity", ""),
        related_id: get(request, "relatedId", ""),
        shootingevents: [],
        shootingevents_scenes: [],
        tags: [],
        created_by: "",
        created_at: now,
        updated_at: now,
        deleted_at: null,
        ...response
      };

      const list = upsert(state.list, element, e => e.id === id);

      return {
        ...state,
        list,
        isFetching: false
      };
    }

    case `${CREATE_ELEMENT}_REJECTED`: {
      const list = [...state.list];
      const id = get(action, "meta.id");
      const index = findIndex(list, c => c.id === id);

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

    case `${UPDATE_ELEMENT}_PENDING`: {
      const list = [...state.list];
      const request: api.UpdateElementRequest = get(action, "meta.request");
      const index = findIndex(list, e => e.id === request.elementId);
      if (index === -1) return state;

      list.splice(
        index,
        1,
        defaults(
          {
            name: request.name,
            category_order: request.categoryOrder,
            related_id: request.relatedId,
            image_id: request.imageId
          },
          list[index]
        )
      );

      return {
        ...state,
        list
      };
    }

    case `${UPDATE_ELEMENT}_FULFILLED`: {
      const list = [...state.list];
      const request: api.UpdateElementRequest = get(action, "meta.request", {});
      const response: api.UpdateElementResponse = get(
        action,
        "payload.data",
        {}
      );
      const index = findIndex(list, e => e.id === request.elementId);
      if (index === -1) return state;

      list.splice(
        index,
        1,
        defaults(
          {
            id: response.id,
            version: response.version,
            name: request.name,
            category_order: request.categoryOrder,
            related_id: request.relatedId,
            image_id: request.imageId
          },
          list[index]
        )
      );

      return {
        ...state,
        list
      };
    }

    case `${UPDATE_ELEMENT}_REJECTED`: {
      // epic will refetch element
      return {
        ...state,
        error: action.payload
      };
    }

    case `${ADD_ITEM_TO_ELEMENT}_PENDING`: {
      const list = [...state.list];
      const request: api.AddItemToElementRequest = get(action, "meta.request");
      const index = findIndex(list, e => e.id === request.elementId);
      if (index === -1) return state;

      list.splice(
        index,
        1,
        defaults(
          {
            items: upsert(
              get(list[index], "items", []),
              {
                item_id: request.itemId,
                item_type: request.itemType,
                element_id: request.elementId
              },
              e =>
                e.item_type === request.itemType && e.item_id === request.itemId
            )
          },
          list[index]
        )
      );

      return {
        ...state,
        list
      };
    }

    case `${ADD_ITEM_TO_ELEMENT}_FULFILLED`: {
      const list = [...state.list];
      const request: api.AddItemToElementRequest = get(
        action,
        "meta.request",
        {}
      );
      const response: api.AddItemToElementResponse = get(
        action,
        "payload.data",
        {}
      );
      const index = findIndex(list, e => e.id === request.elementId);
      if (index === -1) return state;

      list.splice(
        index,
        1,
        defaults(
          {
            id: response.id,
            version: response.version,
            items: upsert(
              get(list[index], "items", []),
              {
                item_id: request.itemId,
                item_type: request.itemType,
                element_id: request.elementId
              },
              e =>
                e.item_type === request.itemType && e.item_id === request.itemId
            )
          },
          list[index]
        )
      );

      return {
        ...state,
        list
      };
    }

    case `${ADD_ITEM_TO_ELEMENT}_REJECTED`: {
      const list = [...state.list];
      const request: api.AddItemToElementRequest = get(
        action,
        "meta.request",
        {}
      );
      const error = action.payload;
      const index = findIndex(list, e => e.id === request.elementId);
      if (index === -1) return { ...state, error };

      list.splice(
        index,
        1,
        defaults(
          {
            items: get(list[index], "items", []).filter(
              i =>
                i.item_type !== request.itemType && i.item_id !== request.itemId
            )
          },
          list[index]
        )
      );

      return { ...state, list, error };
    }

    case `${REMOVE_ITEM_FROM_ELEMENT}_PENDING`: {
      const list = [...state.list];
      const request: api.RemoveItemFromElementRequest = get(
        action,
        "meta.request",
        {}
      );
      const index = findIndex(list, e => e.id === request.elementId);
      if (index === -1) return { ...state };

      list.splice(
        index,
        1,
        defaults(
          {
            items: get(list[index], "items", []).filter(
              i => i.item_id !== request.itemId
            )
          },
          list[index]
        )
      );

      return { ...state, list };
    }

    case `${REMOVE_ITEM_FROM_ELEMENT}_FULFILLED`: {
      const list = [...state.list];
      const request: api.RemoveItemFromElementRequest = get(
        action,
        "meta.request",
        {}
      );
      const response: api.RemoveItemFromElementResponse = get(
        action,
        "payload.data",
        {}
      );
      const index = findIndex(list, e => e.id === request.elementId);
      if (index === -1) return { ...state };

      list.splice(
        index,
        1,
        defaults(
          {
            id: response.id,
            version: response.version,
            items: get(list[index], "items", []).filter(
              i => i.item_id !== request.itemId
            )
          },
          list[index]
        )
      );

      return { ...state, list };
    }

    case `${REMOVE_ITEM_FROM_ELEMENT}_REJECTED`: {
      // epic will re-fetch element
      return { ...state, error: action.payload };
    }

    case `${SYNC_ANCHOR_ADDED}_PENDING`: {
      const request: api.SyncLinksRequest = get(action, "meta.request", {});
      const list = [...state.list];

      // simulate backend action to add one anchor
      if (request.elementId) {
        const index = findIndex(list, e => e.id === request.elementId);
        if (index > -1) {
          const shootingevents_scenes = [...list[index].shootingevents_scenes];
          const sesIndex = findIndex(
            shootingevents_scenes,
            ses => ses.shootingevent_id === request.shootingEventId
          );

          if (sesIndex === -1) {
            // add shooting event scene
            shootingevents_scenes.push({
              shootingevent_id: request.shootingEventId,
              screenplay_id: request.screenplayId
            });
          }

          list[index] = { ...list[index], shootingevents_scenes };
        }
      }

      return {
        ...state,
        list,
        isFetching: true
      };
    }

    case `${SYNC_ANCHOR_REMOVED}_PENDING`: {
      const request: api.SyncLinksRequest = get(action, "meta.request", {});
      const list = [...state.list];

      // simulate backend action to remove one anchor
      if (request.elementId) {
        const index = findIndex(list, e => e.id === request.elementId);

        if (index > -1) {
          let shootingevents_scenes = [...list[index].shootingevents_scenes];

          const numberOfAnchors = shootingevents_scenes.filter(
            ses => ses.shootingevent_id === request.shootingEventId
          ).length;

          if (numberOfAnchors === 1) {
            // remove shooting event scene
            shootingevents_scenes = shootingevents_scenes.filter(
              ses => ses.shootingevent_id !== request.shootingEventId
            );
          }

          list[index] = { ...list[index], shootingevents_scenes };
        }
      }

      return {
        ...state,
        list,
        isFetching: true
      };
    }

    case `${SYNC_ANCHORS_REMOVED}_PENDING`: {
      const request: api.SyncLinksRequest = get(action, "meta.request", {});
      const list = [...state.list];

      // simulate backend action to remove anchors
      if (request.elementId) {
        const index = findIndex(list, e => e.id === request.elementId);

        if (index > -1) {
          let shootingevents_scenes = [...list[index].shootingevents_scenes];

          // remove shooting event scene
          shootingevents_scenes = shootingevents_scenes.filter(
            ses => ses.shootingevent_id !== request.shootingEventId
          );

          list[index] = { ...list[index], shootingevents_scenes };
        }
      }

      return {
        ...state,
        list,
        isFetching: true
      };
    }

    case `${SYNC_ANCHORS}_PENDING`: {
      const request: api.SyncLinksRequest = get(action, "meta.request", {});
      const list = [...state.list];

      // simulate the toggle of anchors
      if (request.elementId) {
        const index = findIndex(list, e => e.id === request.elementId);
        if (index > -1) {
          let shootingevents_scenes = [...list[index].shootingevents_scenes];
          const sesIndex = findIndex(
            shootingevents_scenes,
            ses => ses.shootingevent_id === request.shootingEventId
          );

          if (sesIndex === -1) {
            // add shooting event scene
            shootingevents_scenes.push({
              shootingevent_id: request.shootingEventId,
              screenplay_id: request.screenplayId
            });
          } else {
            // remove shooting event scene
            shootingevents_scenes = shootingevents_scenes.filter(
              ses => ses.shootingevent_id !== request.shootingEventId
            );
          }

          list[index] = { ...list[index], shootingevents_scenes };
        }
      }

      return {
        ...state,
        list,
        isFetching: true
      };
    }

    case `${SYNC_ANCHORS_REMOVED}_FULFILLED`:
    case `${SYNC_ANCHOR_REMOVED}_FULFILLED`:
    case `${SYNC_ANCHOR_ADDED}_FULFILLED`:
    case `${SYNC_ANCHORS}_FULFILLED`:
      return {
        ...state,
        isFetching: false
      };

    case `${SYNC_ANCHORS_REMOVED}_REJECTED`:
    case `${SYNC_ANCHOR_REMOVED}_REJECTED`:
    case `${SYNC_ANCHOR_ADDED}_REJECTED`:
    case `${SYNC_ANCHORS}_REJECTED`:
      return {
        ...state,
        isFetching: false,
        error: action.payload
      };

    case `${SEARCH_ELEMENTS}_PENDING`:
      return {
        ...state,
        search: {
          ...state.search,
          request: get(action, "meta.request", {}),
          isFetching: true
        }
      };

    case `${SEARCH_ELEMENTS}_FULFILLED`: {
      const request = get(action, "meta.request", {});
      const list: Array<Element> = get(action, "payload.data.elements", []);
      const related: Array<RelatedObject> = get(
        action,
        "payload.data.related_objects",
        []
      );

      if (!isEqual(request, state.search.request)) {
        return state;
      }

      return {
        ...state,
        search: {
          ...state.search,
          error: initialState.search.error,
          isFetching: false,
          list,
          related
        }
      };
    }

    case `${SEARCH_ELEMENTS}_REJECTED`:
      return {
        ...state,
        search: {
          ...state.search,
          isFetching: false,
          error: action.payload
        }
      };

    case `${LINK_TO_SHOOTING_EVENT}_PENDING`: {
      const request: api.LinkToShootingEventRequest = get(
        action,
        "meta.request",
        {}
      );
      const list = [...state.list];
      const index = findIndex(list, e => e.id === request.elementId);

      if (index > -1) {
        const si = findIndex(
          list[index].shootingevents,
          se => se.shootingevent_id === request.shootingEventId
        );
        if (si === -1) {
          list[index].shootingevents.push({
            quantity: request.quantity || 1,
            shootingevent_id: request.shootingEventId
          });
        } else {
          list[index].shootingevents.splice(si, 1, {
            ...list[index].shootingevents[si],
            quantity: request.quantity || 1
          });
        }
      }

      return {
        ...state,
        isFetching: true,
        list
      };
    }

    case `${LINK_TO_SHOOTING_EVENT}_FULFILLED`:
      return {
        ...state,
        isFetching: false
      };

    case `${LINK_TO_SHOOTING_EVENT}_REJECTED`: {
      const request: api.LinkToShootingEventRequest = get(
        action,
        "meta.request",
        {}
      );
      const list = [...state.list];
      const index = findIndex(list, e => e.id === request.elementId);

      if (index > -1) {
        const si = findIndex(
          list[index].shootingevents,
          se => se.shootingevent_id === request.shootingEventId
        );
        if (si > -1) {
          list[index].shootingevents.splice(si, 1);
        }
      }

      return {
        ...state,
        isFetching: false,
        list
      };
    }

    case `${UNLINK_FROM_SHOOTING_EVENT}_PENDING`: {
      const request: api.UnlinkFromShootingEventRequest = get(
        action,
        "meta.request",
        {}
      );
      const list = [...state.list];
      const index = findIndex(list, e => e.id === request.elementId);

      if (index > -1) {
        const si = findIndex(
          list[index].shootingevents,
          se => se.shootingevent_id === request.shootingEventId
        );
        if (si > -1) {
          list[index].shootingevents.splice(si, 1);
        }
      }

      return {
        ...state,
        isFetching: false,
        list
      };
    }

    case `${UNLINK_FROM_SHOOTING_EVENT}_FULFILLED`:
      return {
        ...state,
        isFetching: false
      };

    case `${UNLINK_FROM_SHOOTING_EVENT}_REJECTED`: {
      const request: api.UnlinkFromShootingEventRequest = get(
        action,
        "meta.request",
        {}
      );
      const list = [...state.list];
      const index = findIndex(list, e => e.id === request.elementId);

      if (index > -1) {
        const si = findIndex(
          list[index].shootingevents,
          se => se.shootingevent_id === request.shootingEventId
        );
        if (si === -1) {
          list[index].shootingevents.push({
            quantity: 1,
            shootingevent_id: request.shootingEventId
          });
        }
      }

      return {
        ...state,
        isFetching: false,
        error: action.payload,
        list
      };
    }

    case ELEMENT_REMOVED: {
      const element = get(action, "payload", {});
      const list = state.list.slice().filter(el => el.id !== element.id);

      return {
        ...state,
        list
      };
    }

    default:
      return state;
  }
}

export const deleteElement = (request: api.DeleteElementRequest) => ({
  type: DELETE_ELEMENT,
  payload: api.deleteElement(request),
  meta: { request }
});

export const fetchElement = (request: api.GetMetadataRequest) => ({
  type: FETCH_ELEMENT,
  payload: api.getMetadata(request),
  meta: { request }
});

export const fetchElements = (request: api.ListElementsRequest) => ({
  type: FETCH_ELEMENTS,
  payload: api.listElements(request),
  meta: { request }
});

export const createElement = (request: api.CreateElementRequest) => ({
  type: CREATE_ELEMENT,
  payload: api.createElement(request),
  meta: {
    request,
    id: ksuid.randomSync().string
  }
});

export const syncAnchors = (request: api.SyncLinksRequest) => ({
  type: SYNC_ANCHORS,
  payload: api.syncLinks(request),
  meta: { request }
});

export const syncAnchorAdded = (request: api.SyncLinksRequest) => ({
  type: SYNC_ANCHOR_ADDED,
  payload: api.syncLinks(request),
  meta: { request }
});

export const syncAnchorRemoved = (request: api.SyncLinksRequest) => ({
  type: SYNC_ANCHOR_REMOVED,
  payload: api.syncLinks(request),
  meta: { request }
});

export const syncAnchorsRemoved = (request: api.SyncLinksRequest) => ({
  type: SYNC_ANCHORS_REMOVED,
  payload: api.syncLinks(request),
  meta: { request }
});

export const searchElements = (request: {
  +productionId: string,
  +name: string,
  +categoryId: string,
  +limit?: number,
  +offset?: number
}) => ({
  type: SEARCH_ELEMENTS,
  payload: api.listElements(request),
  meta: { request }
});

export const linkToShootingEvent = (request: {|
  +productionId: string,
  +elementId: string,
  +shootingEventId: string,
  +quantity?: number
|}) => ({
  type: LINK_TO_SHOOTING_EVENT,
  payload: api.linkToShootingEvent(request),
  meta: { request }
});

export const unlinkFromShootingEvent = (request: {|
  +productionId: string,
  +elementId: string,
  +shootingEventId: string
|}) => ({
  type: UNLINK_FROM_SHOOTING_EVENT,
  payload: api.unlinkFromShootingEvent(request),
  meta: { request }
});

export const updateElement = (request: api.UpdateElementRequest) => ({
  type: UPDATE_ELEMENT,
  payload: api.updateElement(request),
  meta: { request }
});

export const addItemToElement = (request: api.AddItemToElementRequest) => ({
  type: ADD_ITEM_TO_ELEMENT,
  payload: api.addItemToElement(request),
  meta: { request }
});

export const removeItemFromElement = (
  request: api.RemoveItemFromElementRequest
) => ({
  type: REMOVE_ITEM_FROM_ELEMENT,
  payload: api.removeItemFromElement(request),
  meta: { request }
});
