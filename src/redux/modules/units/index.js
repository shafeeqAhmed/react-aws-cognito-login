// @flow
import { get, findIndex } from "lodash";
import * as api from "./api";

export const SELECT_UNIT: "procliq-web-editor/units/SELECT_UNIT" =
  "procliq-web-editor/units/SELECT_UNIT";

export const FETCH_UNITS: "procliq-web-editor/units/FETCH_UNITS" =
  "procliq-web-editor/units/FETCH_UNITS";

export const CREATE_UNIT: "procliq-editor-web/units/CREATE_UNIT" =
  "procliq-editor-web/units/CREATE_UNIT";

export const DELETE_UNIT: "procliq-editor-web/units/DELETE_UNIT" =
  "procliq-editor-web/units/DELETE_UNIT";

/**
 * Aggregator actions
 */
export const INSERT_UNIT: "procliq-editor-web/units/INSERT_UNIT" =
  "procliq-editor-web/units/INSERT_UNIT";

export const MODIFY_UNIT: "procliq-editor-web/units/MODIFY_UNIT" =
  "procliq-editor-web/units/MODIFY_UNIT";

export const REMOVE_UNIT: "procliq-editor-web/units/REMOVE_UNIT" =
  "procliq-editor-web/units/REMOVE_UNIT";

export type Unit = {|
  id: string,
  version: number,
  +production_id: string,
  name: string,
  +created_by: string,
  +created_at: string,
  +updated_at: string,
  +deleted_at: ?string,
  screenplay_id: string,
  shootingevents_count: number
|};

export type State = {|
  +currentUnitId: $PropertyType<Unit, "id">,
  +isFetching: boolean,
  +list: Array<Unit>,
  +error: ?string
|};

const initialState = {
  isFetching: false,
  currentUnitId: "",
  list: [],
  error: ""
};

export default function reducer(
  state: State = initialState,
  action: GlobalFSA<*>
): State {
  switch (action.type) {
    case `${FETCH_UNITS}_PENDING`:
      return {
        ...state,
        isFetching: true
      };

    case `${FETCH_UNITS}_FULFILLED`: {
      let currentUnitId = state.currentUnitId;

      if (
        state.list.length === 0 &&
        get(action, "payload.data.units", []).length > 0
      ) {
        currentUnitId = get(action, "payload.data.units[0].id");
      }

      return {
        ...state,
        error: initialState.error,
        isFetching: false,
        list: get(action, "payload.data.units", []),
        currentUnitId
      };
    }

    case `${FETCH_UNITS}_REJECTED`:
      return {
        ...state,
        isFetching: false,
        error: action.payload
      };

    case `${SELECT_UNIT}`: {
      return {
        ...state,
        currentUnitId: action.payload
      };
    }

    case `${CREATE_UNIT}_PENDING`: {
      const { productionId, name } = get(action, "payload", {});

      return {
        ...state,
        isFetching: true,
        list: [
          ...state.list,
          {
            id: name,
            version: 0,
            name,
            production_id: productionId,
            created_by: "",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            deleted_at: null,
            // TODO: take screenplay id from the action
            screenplay_id: "",
            shootingevents_count: 0
          }
        ]
      };
    }

    case `${CREATE_UNIT}_REJECTED`: {
      return {
        ...state,
        isFetching: false,
        error: get(action, "payload.data.error.msg")
      };
    }

    case `${CREATE_UNIT}_FULFILLED`: {
      const newUnit: Unit = get(action, "payload.data.unit");
      const units = state.list.slice();
      const index = findIndex(
        units,
        u =>
          u.id === newUnit.name &&
          u.version === 0 &&
          u.production_id === newUnit.production_id
      );

      if (index === -1) {
        return state;
      }

      units[index] = newUnit;

      return {
        ...state,
        list: units,
        isFetching: false,
        error: undefined
      };
    }

    case `${DELETE_UNIT}_PENDING`: {
      const { unitId } = get(action, "payload", {});
      const units = state.list.filter(u => u.id !== unitId);

      return {
        ...state,
        isFetching: true,
        list: units
      };
    }

    case `${DELETE_UNIT}_REJECTED`: {
      return {
        ...state,
        isFetching: false,
        error: get(action, "payload.message")
      };
    }

    case `${DELETE_UNIT}_FULFILLED`: {
      return {
        ...state,
        isFetching: false,
        error: undefined
      };
    }

    case INSERT_UNIT:
    case MODIFY_UNIT: {
      const unit: Unit = get(action, "payload");

      const units = state.list.slice();
      const index = findIndex(state.list, { id: unit.id });

      if (index === -1) {
        units.push(unit);
      } else {
        units.splice(index, 1, unit);
      }

      const newState = {
        ...state,
        list: units
      };

      return newState;
    }

    case REMOVE_UNIT: {
      const unit: Unit = get(action, "payload");

      const units = state.list.filter(s => s.id !== unit.id);

      return {
        ...state,
        list: units
      };
    }

    default:
      return state;
  }
}

/**
 * Action creators.
 */
export const fetchUnits = (request: api.ListUnitsRequest) => ({
  type: FETCH_UNITS,
  payload: {
    promise: api.listUnits(request),
    data: { productionId: request.productionId }
  }
});

export const createUnit = (productionId: number, name: string) => ({
  type: CREATE_UNIT,
  payload: {
    promise: api.createUnit({ productionId, name }),
    data: { productionId, name }
  }
});

export const deleteUnit = (productionId: number, unitId: string) => ({
  type: DELETE_UNIT,
  payload: {
    promise: api.deleteUnit({ productionId, unitId }),
    data: { productionId, unitId }
  }
});

export const selectUnit = (unitId: ?string) => ({
  type: SELECT_UNIT,
  payload: unitId
});
