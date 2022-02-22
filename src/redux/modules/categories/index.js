// @flow
import { findIndex, get } from "lodash";
import ksuid from "ksuid";
import * as api from "./api";
import { upsert } from "src/helpers/lodash";

export * from "./selectors";

export const FETCH_CATEGORIES: "procliq-web-editor/categories/FETCH_CATEGORIES" =
  "procliq-web-editor/categories/FETCH_CATEGORIES";

export const CREATE_CATEGORY: "procliq-web-editor/categories/CREATE_CATEGORY" =
  "procliq-web-editor/categories/CREATE_CATEGORY";

export const CategoryTypes = {
  CREW: ("crew": "crew"),
  CAST: ("cast": "cast"),
  EXTRAS: ("extras": "extras"),
  STUNTS: ("stunts": "stunts"),
  PHYSICAL: ("physical": "physical"),
  DIGITAL: ("digital": "digital")
};

export type CategoryType = $Values<typeof CategoryTypes>;

export type Category = {|
  +id: string,
  +version: number,
  +production_id: string,
  +name: string,
  +color: string,
  +type: CategoryType,
  +created_by: string,
  +created_at: string,
  +updated_at: string,
  +deleted_at: ?string
|};

export type State = {|
  +isFetching: boolean,
  +list: Array<Category>,
  +error: ?string
|};

const initialState = {
  isFetching: false,
  list: [],
  error: ""
};

export default function reducer(
  state: State = initialState,
  action: GlobalFSA<*>
): State {
  switch (action.type) {
    case `${FETCH_CATEGORIES}_PENDING`:
      return {
        ...state,
        isFetching: true
      };

    case `${FETCH_CATEGORIES}_FULFILLED`:
      return {
        ...state,
        error: initialState.error,
        isFetching: false,
        list: get(action, "payload.data.categories")
      };

    case `${FETCH_CATEGORIES}_REJECTED`:
      return {
        ...state,
        isFetching: false,
        error: action.payload
      };

    case `${CREATE_CATEGORY}_PENDING`: {
      const list = [...state.list];
      const request: api.CreateCategoryRequest = get(
        action,
        "meta.request",
        {}
      );
      const now = new Date().toISOString();
      const id = get(action, "meta.id");
      if (!id) return state;

      const category: Category = {
        id,
        version: 0,
        production_id: get(request, "productionId", ""),
        name: get(request, "name", ""),
        color: get(request, "color", ""),
        type: get(request, "type"),
        created_by: "",
        created_at: now,
        updated_at: now,
        deleted_at: null
      };

      list.push(category);

      return {
        ...state,
        list,
        isFetching: true
      };
    }

    case `${CREATE_CATEGORY}_FULFILLED`: {
      const request = get(action, "meta.request", {});
      const response: api.CreateCategoryResponse = get(
        action,
        "payload.data",
        {}
      );

      const now = new Date().toISOString();
      const id = get(action, "meta.id");

      const category: Category = {
        id,
        version: 0,
        production_id: get(request, "productionId", ""),
        name: get(request, "name", ""),
        color: get(request, "color", ""),
        type: get(request, "type"),
        created_by: "",
        created_at: now,
        updated_at: now,
        deleted_at: null,
        ...response
      };

      const list = upsert(state.list, category, c => c.id === id);

      return {
        ...state,
        list,
        isFetching: false
      };
    }

    case `${CREATE_CATEGORY}_REJECTED`: {
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

    default:
      return state;
  }
}

export const fetchCategories = (request: api.ListCategoriesRequest) => ({
  type: FETCH_CATEGORIES,
  payload: api.listCategories(request)
});

export const createCategory = (request: api.CreateCategoryRequest) => ({
  type: CREATE_CATEGORY,
  payload: api.createCategory(request),
  meta: {
    request,
    id: ksuid.randomSync().string
  }
});
