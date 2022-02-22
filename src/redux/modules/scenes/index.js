// @flow

export const SELECT_SCENE: "procliq-web-editor/scenes/SELECT_SCENE" =
  "procliq-web-editor/scenes/SELECT_SCENE";
export const FETCH_SCENES: "procliq-web-editor/scenes/FETCH_SCENES" =
  "procliq-web-editor/scenes/FETCH_SCENES";

export type Scene = {|
  +id: string,
  +version: number,
  +production_id: string,
  +screenplay_id: string,
  +title: string,
  +sequence: number,
  +code: string,
  +omitted: boolean,
  +continuous: boolean,
  +created_by: string,
  +created_at: string,
  +updated_at: string,
  +deleted_at: ?string,
  +removed_at: ?string
|};

export type State = {|
  +currentSceneId: $PropertyType<Scene, "id">,
  +isFetching: boolean,
  +list: Array<Scene>,
  +error: ?string
|};

const initialState = {
  isFetching: false,
  currentSceneId: "1",
  // TODO: replace with API call
  list: [
    {
      id: "1ACjL6vbp1IC4WWjJqWfWjrrrNa",
      version: 1,
      production_id: "4",
      screenplay_id: "1A57Ptq9LRAeJjfoYH7E9SAZpZF",
      title: "EXT. BRICK'S PATIO - DAY",
      sequence: 1,
      code: "1",
      omitted: false,
      continuous: false,
      created_by: "8141b964-80dc-4993-a9cc-c79c145aefd7",
      created_at: "2018-09-14T15:03:46Z",
      updated_at: "2018-09-14T15:03:46Z",
      deleted_at: null,
      removed_at: null
    },
    {
      id: "1ACjL6cjQ7RH4T4rkY3PspAWwII",
      version: 1,
      production_id: "4",
      screenplay_id: "1A57Ptq9LRAeJjfoYH7E9SAZpZF",
      title: "INT. TRAILER HOME - DAY",
      sequence: 2,
      code: "2",
      omitted: false,
      continuous: false,
      created_by: "8141b964-80dc-4993-a9cc-c79c145aefd7",
      created_at: "2018-09-14T15:03:48Z",
      updated_at: "2018-09-14T15:03:48Z",
      deleted_at: null,
      removed_at: null
    }
  ],
  error: ""
};

export default function reducer(
  state: State = initialState,
  action: GlobalFSA<*>
): State {
  switch (action.type) {
    case `${FETCH_SCENES}_PENDING`:
      return {
        ...state,
        isFetching: true
      };

    case `${FETCH_SCENES}_FULFILLED`:
      return {
        ...state,
        error: initialState.error,
        isFetching: false,
        list: action.payload
      };

    case `${FETCH_SCENES}_REJECTED`:
      return {
        ...state,
        isFetching: false,
        error: action.payload
      };

    case `${SELECT_SCENE}`: {
      return {
        ...state,
        currentSceneId: action.payload
      };
    }

    default:
      return state;
  }
}

export const selectScene = (sceneId: $PropertyType<Scene, "id">) => ({
  type: SELECT_SCENE,
  payload: sceneId
});
