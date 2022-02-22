// @flow

import { get, omit, partition } from "lodash";
import * as api from "./api";
import { assignSceneColor } from "src/helpers/api";

export * from "./selectors";

/**
 * Action types.
 */
export const GET_METADATA: "procliq-editor-web/screenplay/GET_METADATA" =
  "procliq-editor-web/screenplay/GET_METADATA";

export const GET_CONTENT: "procliq-editor-web/screenplay/GET_CONTENT" =
  "procliq-editor-web/screenplay/GET_CONTENT";

export const GET_CREDENTIALS: "procliq-editor-web/screenplay/GET_CREDENTIALS" =
  "procliq-editor-web/screenplay/GET_CREDENTIALS";

export const GET_HISTORY: "procliq-editor-web/screenplay/GET_HISTORY" =
  "procliq-editor-web/screenplay/GET_HISTORY";

export const SWITCH_MODE: "procliq-editor-web/screenplay/SWITCH_MODE" =
  "procliq-editor-web/screenplay/SWITCH_MODE";

export const FETCH_SCENES: "procliq-editor-web/screenplay/FETCH_SCENES" =
  "procliq-editor-web/screenplay/FETCH_SCENES";

export const SCENES_UPDATED: "procliq-editor-web/screenplay/SCENES_UPDATED" =
  "procliq-editor-web/screenplay/SCENES_UPDATED";

export const USERS_UPDATED: "procliq-editor-web/screenplay/USERS_UPDATED" =
  "procliq-editor-web/screenplay/USERS_UPDATED";

export const CURSOR_UPDATED: "procliq-editor-web/screenplay/CURSOR_UPDATED" =
  "procliq-editor-web/screenplay/CURSOR_UPDATED";

export const FILTER_SCENES: "procliq-editor-web/screenplay/FILTER_SCENES" =
  "procliq-editor-web/screenplay/FILTER_SCENES";

export const LOAD_EDITOR: "procliq-editor-web/screenplay/LOAD_EDITOR" =
  "procliq-editor-web/screenplay/LOAD_EDITOR";

export const SELECT_SCENE: "procliq-editor-web/screenplay/SELECT_SCENE" =
  "procliq-editor-web/screenplay/SELECT_SCENE";

export const COLLAPSE_SCENES: "procliq-editor-web/screenplay/COLLAPSE_SCENES" =
  "procliq-editor-web/screenplay/COLLAPSE_SCENES";

export const LOCK_SCENES: "procliq-editor-web/screenplay/LOCK_SCENES" =
  "procliq-editor-web/screenplay/LOCK_SCENES";

export const ORDER_BY_SEQUENCE: "procliq-editor-web/screenplay/ORDER_BY_SEQUENCE" =
  "procliq-editor-web/screenplay/ORDER_BY_SEQUENCE";

export const TOGGLE_SPELL_CHECKER: "procliq-editor-web/screenplay/TOGGLE_SPELL_CHECKER" =
  "procliq-editor-web/screenplay/TOGGLE_SPELL_CHECKER";

export const ADD_TO_DICTIONARY: "procliq-editor-web/screenplay/ADD_TO_DICTIONARY" =
  "procliq-editor-web/screenplay/ADD_TO_DICTIONARY";

export const REMOVE_FROM_DICTIONARY: "procliq-editor-web/screenplay/REMOVE_FROM_DICTIONARY" =
  "procliq-editor-web/screenplay/REMOVE_FROM_DICTIONARY";

export const UPDATE_THREAD_ID: "procliq-editor-web/screenplay/UPDATE_THREAD_ID" =
  "procliq-editor-web/screenplay/UPDATE_THREAD_ID";

export const FETCH_SHOOTING_EVENTS: "procliq-editor-web/screenplay/FETCH_SHOOTING_EVENTS" =
  "procliq-editor-web/screenplay/FETCH_SHOOTING_EVENTS";

export const SELECT_SHOOTING_EVENT: "procliq-editor-web/screenplay/SELECT_SHOOTING_EVENT" =
  "procliq-editor-web/screenplay/SELECT_SHOOTING_EVENT";

export const SPLIT_SHOOTING_EVENT: "procliq-editor-web/screenplay/SPLIT_SHOOTING_EVENT" =
  "procliq-editor-web/screenplay/SPLIT_SHOOTING_EVENT";

export const DELETE_SHOOTING_EVENT: "procliq-editor-web/screenplay/DELETE_SHOOTING_EVENT" =
  "procliq-editor-web/screenplay/DELETE_SHOOTING_EVENT";

export const REMOVE_SCENE_FROM_SHOOTING_EVENT: "procliq-editor-web/screenplay/REMOVE_SCENE_FROM_SHOOTING_EVENT" =
  "procliq-editor-web/screenplay/REMOVE_SCENE_FROM_SHOOTING_EVENT";

export const ADD_SCENE_TO_SHOOTING_EVENT: "procliq-editor-web/screenplay/ADD_SCENE_TO_SHOOTING_EVENT" =
  "procliq-editor-web/screenplay/ADD_SCENE_TO_SHOOTING_EVENT";

/**
 * State definition.
 */

export const ShootingEventSceneTypes = {
  PRIMARY: ("PRIMARY": "PRIMARY"),
  SECONDARY: ("SECONDARY": "SECONDARY")
};

export type ShootingEventSceneType = $Values<typeof ShootingEventSceneTypes>;

export type ShootingEventScene = {
  +sceneId: string,
  +sceneType: ShootingEventSceneType,
  +sceneCode: string
};

export const CategoryTypes = {
  CREW: ("crew": "crew"),
  CAST: ("cast": "cast"),
  EXTRAS: ("extras": "extras"),
  CUSTOM: ("custom": "custom")
};

export type CategoryType = $Values<typeof CategoryTypes>;

export type Category = {
  id: string,
  version: number,
  productionId: number,
  name: string,
  color: string,
  type: CategoryType,
  createdBy: string,
  createdAt: string,
  updatedAt: string,
  deletedAt: ?string
};

export type ShootingEventElement = {|
  +id: string,
  +name: string,
  +related_id: string,
  +category_id: string,
  +category_type: CategoryType
|};

export const ShootingEventSplitTypes = {
  EXTEND: ("split": "split"),
  RESHOOT: ("reshoot": "reshoot")
};

export type ShootingEventSplitType = $Values<typeof ShootingEventSplitTypes>;

export const SetTypes = {
  EXT: ("EXT": "EXT"),
  INT: ("INT": "INT"),
  IE: ("I/E": "I/E"),
  EST: ("EST": "EST")
};

export type SetType = $Values<typeof SetTypes>;

export type Set = {|
  +id: string,
  +type: SetType,
  +name: string,
  +timeOfDay: string,
  +storyDay: string
|};

export type ShootingEvent = {
  +id: string,
  +version: number,
  +productionId: number,
  +screenplayId: string,
  +sequence: number,
  +name: string,
  +summary: ?string,
  +scenes: Array<ShootingEventScene>,
  +elements: Array<ShootingEventElement>,
  +code: string,
  +set: ?Set,
  +setId: ?$PropertyType<Set, "id">,
  +unitId: ?string,
  +locationName: ?string,
  +locationLatitude: string,
  +locationLongitude: string,
  +pages: string,
  +durationTime: string,
  +durationTimeOverride: string,
  +shotGoal: string,
  +splitCount: number,
  +splittedFromId: ?string,
  +splitType: ShootingEventSplitType,
  +splitIndex: number,
  +mergedToId: ?string,
  +generatedFromSceneId: string,
  +createdBy: string,
  +createdAt: string,
  +updatedAt: string,
  +deletedAt: ?string
};

export const Statuses = {
  draft: "draft",
  published: "published"
};

export const SceneOrders = {
  sequence: ("sequence": "sequence")
};

export type SceneOrder = $Values<typeof SceneOrders>;

export type Status = $Values<typeof Statuses>;

export type Metadata = {
  +id: string,
  +version?: number,
  +productionId?: number,
  +fileId?: string,
  +versionCode?: ?string,
  +status?: Status,
  +lastResolution?: ?string,
  +createdBy?: string,
  +createdAt?: string,
  +updatedAt?: string,
  +deletedAt?: ?string,
  +removedAt?: ?string
};

export type LineContent = {
  +text: string,
  +attrs: { [key: string]: string }
};

export const Formats = {
  None: "",
  Action: "action",
  ActStart: "act-start",
  ActEnd: "act-end",
  Character: "character",
  Dialogue: "dialogue",
  Scene: "scene",
  Transition: "transition",
  Parenthetical: "parenthetical"
};

export type Format = $Values<typeof Formats>;

export type Line = {
  +format: Format,
  +content: Array<LineContent>
};

export type Content = Array<Line>;

export type Credentials = {
  +projectId: string,
  +apiKey: string,
  +accessToken: string
};

export const EventTypes = {
  Created: "Created",
  LastResolutionSet: "LastResolutionSet",
  VersionSet: "VersionSet",
  Deleted: "Deleted",
  Restored: "Restored",
  Removed: "Removed"
};

export type EventType = $Values<typeof EventTypes>;

export type Created = {
  +id: string,
  +version: number,
  +at: string,
  +productionId: string,
  +userId: string,
  +fileId: string
};

export type LastResolutionSet = {
  +id: string,
  +version: number,
  +at: string,
  +userId: string,
  +lastResolution: string
};

export type VersionSet = {
  +id: string,
  +version: number,
  +at: string,
  +userId: string,
  +versionCode: string
};

export type Deleted = {
  +id: string,
  +version: number,
  +at: string,
  +userId: string
};

export type Restored = {
  +id: string,
  +version: number,
  +at: string,
  +userId: string
};

export type Removed = {
  +id: string,
  +version: number,
  +at: string,
  +userId: string
};

export type Event = {
  +type: EventType,
  +data: Created | LastResolutionSet | VersionSet | Deleted | Restored | Removed
};

export type History = Array<Event>;

export type Scene = {
  +id: string,
  +version: number,
  +productionId: string,
  +screenplayId: string,
  +title: string,
  +sequence: number,
  +code: string,
  +locked: boolean,
  +createdBy: string,
  +createdAt: string,
  +updatedAt: string,
  +deletedAt: ?string
};

export type ScreenplayScene = {
  +lineNum: number,
  +sceneId: string,
  +sceneTitle: ?string,
  +sceneCode: string,
  +sceneOmitted: boolean,
  +sceneLocked: boolean,
  +color?: string
};

export type ScreenplayUser = {
  +userId: string,
  +color: string,
  +cursor: ?{
    +position: number,
    +selectionEnd: number,
    +lineClass: ?string
  }
};

export const LineClasses = {
  None: ("": ""),
  Action: ("pc-action": "pc-action"),
  Character: ("pc-character": "pc-character"),
  Dialogue: ("pc-dialogue": "pc-dialogue"),
  Scene: ("pc-scene": "pc-scene"),
  Transition: ("pc-transition": "pc-transition"),
  Parenthetical: ("pc-parenthetical": "pc-parenthetical")
};

export type LineClass = $Values<typeof LineClasses>;

export type Cursor = {
  +lineClass: ?LineClass,
  +elementId: ?string,
  +currentScene: ?ScreenplayScene,
  +threadId: ?string,
  +selections: ?Array<string>
};

export type Screenplay = {
  +content: ?Content,
  +metadata: ?Metadata,
  +history: ?History,
  +credentials: ?Credentials,
  +scenes: ?Array<ScreenplayScene>,
  +users: ?Array<ScreenplayUser>,
  +cursor: ?Cursor
};

export const Modes = {
  EDIT: ("edit": "edit"),
  TAG: ("tag": "tag"),
  PLAN: ("plan": "plan"),
  SCHEDULE: ("schedule": "schedule"),
  FILM: ("film": "film")
};

export type Spellchecker = {
  +active: boolean,
  +ignored: { [word: string]: boolean }
};

export type Mode = $Values<typeof Modes>;

export type State = {
  +screenplay: ?Screenplay,
  +mode: ?Mode,
  +areScenesCollapsed: boolean,
  +sceneFilter: string,
  +selectedSceneId: ?string,
  +spellchecker: Spellchecker,
  +isFetching: boolean,
  +scenesOrderedBy: ?SceneOrder,
  +error: ?string,
  +selectedThreadId?: string,
  +shootingEvents: Array<ShootingEvent>,
  +selectedShootingEventId: ?string
};

export const initialState: State = {
  screenplay: undefined,
  mode: undefined,
  areScenesCollapsed: false,
  sceneFilter: "",
  selectedSceneId: undefined,
  spellchecker: {
    active: false,
    ignored: {}
  },
  isFetching: false,
  error: undefined,
  scenesOrderedBy: undefined,
  selectedThreadId: undefined,
  shootingEvents: [],
  selectedShootingEventId: undefined
};

/**
 * Reducer.
 */
export default function reducer(
  state: State = initialState,
  action: GlobalFSA<*>
): State {
  switch (action.type) {
    case `${GET_METADATA}_PENDING`:
      return {
        ...state,
        isFetching: true
      };

    case `${GET_METADATA}_FULFILLED`: {
      return {
        ...state,
        screenplay: {
          ...(state.screenplay || {}),
          metadata: get(action, "payload.data.metadata")
        },
        isFetching: false,
        error: undefined
      };
    }

    case `${GET_METADATA}_REJECTED`:
      return {
        ...state,
        isFetching: false,
        error: action.payload
      };

    case `${GET_CONTENT}_PENDING`:
      return {
        ...state,
        isFetching: true
      };

    case `${GET_CONTENT}_FULFILLED`: {
      return {
        ...state,
        screenplay: {
          ...(state.screenplay || {}),
          content: get(action, "payload.data.content")
        },
        isFetching: false,
        error: undefined
      };
    }

    case `${GET_CONTENT}_REJECTED`:
      return {
        ...state,
        isFetching: false,
        error: action.payload
      };

    case `${GET_CREDENTIALS}_PENDING`:
      return {
        ...state,
        isFetching: true
      };

    case `${GET_CREDENTIALS}_FULFILLED`: {
      return {
        ...state,
        screenplay: {
          ...(state.screenplay || {}),
          credentials: get(action, "payload.data.credentials")
        },
        isFetching: false,
        error: undefined
      };
    }

    case `${GET_CREDENTIALS}_REJECTED`:
      return {
        ...state,
        isFetching: false,
        error: action.payload
      };

    case `${GET_HISTORY}_PENDING`:
      return {
        ...state,
        isFetching: true
      };

    case `${GET_HISTORY}_FULFILLED`: {
      return {
        ...state,
        screenplay: {
          ...(state.screenplay || {}),
          history: get(action, "payload.data.history")
        },
        isFetching: false,
        error: undefined
      };
    }

    case `${GET_HISTORY}_REJECTED`:
      return {
        ...state,
        isFetching: false,
        error: action.payload
      };

    case SWITCH_MODE:
      return {
        ...state,
        mode: get(action, "payload.mode")
      };

    case SCENES_UPDATED: {
      return {
        ...state,
        screenplay: {
          ...(state.screenplay || {}),
          scenes: assignSceneColor(get(action, "payload.scenes"))
        }
      };
    }

    case USERS_UPDATED: {
      return {
        ...state,
        screenplay: {
          ...(state.screenplay || {}),
          users: get(action, "payload.users")
        }
      };
    }

    case CURSOR_UPDATED: {
      return {
        ...state,
        screenplay: {
          ...(state.screenplay || {}),
          cursor: get(action, "payload.cursor")
        },
        selectedSceneId: get(
          action,
          "payload.cursor.currentScene.sceneId",
          get(action, "payload.cursor.currentScene.sceneCode", null)
        ),
        selectedThreadId: get(action, "payload.cursor.threadId", null)
      };
    }

    case FILTER_SCENES: {
      return {
        ...state,
        sceneFilter: get(action, "payload.filter")
      };
    }

    case `${LOAD_EDITOR}_PENDING`:
      return {
        ...state,
        isFetching: true
      };

    case `${LOAD_EDITOR}_FULFILLED`: {
      return {
        ...state,
        isFetching: false
      };
    }

    case `${LOAD_EDITOR}_REJECTED`:
      return {
        ...state,
        isFetching: false,
        error: get(action, "payload.error")
      };

    case SELECT_SCENE:
      return {
        ...state,
        selectedSceneId: get(
          action,
          "payload.sceneId",
          get(action, "payload.sceneCode")
        )
      };

    case `${LOCK_SCENES}_PENDING`:
      return {
        ...state,
        isFetching: true
      };

    case `${LOCK_SCENES}_FULFILLED`: {
      return {
        ...state,
        isFetching: false
      };
    }

    case `${LOCK_SCENES}_REJECTED`:
      return {
        ...state,
        isFetching: false,
        error: action.payload
      };

    case ORDER_BY_SEQUENCE:
      return {
        ...state,
        scenesOrderedBy: SceneOrders.sequence
      };
    case TOGGLE_SPELL_CHECKER:
      return {
        ...state,
        spellchecker: {
          ...state.spellchecker,
          active: !state.spellchecker.active
        }
      };

    case ADD_TO_DICTIONARY:
      return {
        ...state,
        spellchecker: {
          ...state.spellchecker,
          ignored: {
            ...state.spellchecker.ignored,
            [get(action, "payload.word")]: true
          }
        }
      };

    case REMOVE_FROM_DICTIONARY:
      return {
        ...state,
        spellchecker: {
          ...state.spellchecker,
          ignored: omit(state.spellchecker.ignored, get(action, "payload.word"))
        }
      };

    case COLLAPSE_SCENES:
      return {
        ...state,
        areScenesCollapsed: !state.areScenesCollapsed
      };

    case UPDATE_THREAD_ID:
      return {
        ...state,
        selectedThreadId: get(action, "payload", null)
      };

    case `${FETCH_SHOOTING_EVENTS}_PENDING`:
      return {
        ...state,
        isFetching: true
      };

    case `${FETCH_SHOOTING_EVENTS}_FULFILLED`: {
      const shootingEvents = get(action, "payload.data.shootingEvents", []);
      const selectedShootingEventId = shootingEvents[0] && shootingEvents[0].id;

      return {
        ...state,
        shootingEvents,
        selectedShootingEventId,
        isFetching: false
      };
    }

    case `${FETCH_SHOOTING_EVENTS}_REJECTED`:
      return {
        ...state,
        isFetching: false,
        error: action.payload
      };

    // optimistic update
    // not possible here because we don't know the ID of the new shooting event
    case `${SPLIT_SHOOTING_EVENT}_PENDING`: {
      return state;
      // const { shootingEventId, splitType } = get(action, "payload");

      // let shootingEvents: Array<ShootingEvent> = state.shootingEvents.slice();
      // let match: Array<ShootingEvent> = [];

      // [match, shootingEvents] = partition(
      //   shootingEvents,
      //   se => se.id === shootingEventId
      // );

      // if (!match.length) return state;

      // shootingEvents = [
      //   ...shootingEvents,
      //   ...match.map(m => ({ ...m, splitCount: m.splitCount + 1 })),
      //   {
      //     ...match[0],
      //     splittedFromId: shootingEventId,
      //     sequence: match[0].sequence + 0.5
      //   }
      // ];

      // return {
      //   ...state,
      //   shootingEvents
      // };
    }

    case `${SPLIT_SHOOTING_EVENT}_REJECTED`: {
      return {
        ...state,
        error: `${get(action, "payload")}`
      };
    }

    case `${SPLIT_SHOOTING_EVENT}_FULFILLED`: {
      return state;
    }

    // optimistic update
    case `${DELETE_SHOOTING_EVENT}_PENDING`: {
      const { shootingEventId } = get(action, "payload");

      let shootingEvents: Array<ShootingEvent> = state.shootingEvents.slice();
      let match: Array<ShootingEvent> = [];

      [match, shootingEvents] = partition(
        shootingEvents,
        se => se.id === shootingEventId
      );

      if (match[0]) {
        shootingEvents = [
          ...shootingEvents,
          {
            ...match[0],
            deletedAt: new Date().toISOString()
          }
        ];
      }

      return {
        ...state,
        shootingEvents
      };
    }

    case `${DELETE_SHOOTING_EVENT}_REJECTED`: {
      return {
        ...state,
        error: `${get(action, "payload")}`
      };
    }

    case `${DELETE_SHOOTING_EVENT}_FULFILLED`: {
      return state;
    }

    // optimistic update
    case `${ADD_SCENE_TO_SHOOTING_EVENT}_PENDING`: {
      const { shootingEventId, sceneId, sceneType } = get(action, "payload");

      // verify shooting event is in the current screenplay
      const screenplayId = get(state, "screenplay.metadata.id");
      let shootingEvents = state.shootingEvents.slice();
      const shootingEvent = shootingEvents.find(s => s.id === shootingEventId);
      if (!shootingEvent || shootingEvent.screenplayId !== screenplayId) {
        return state;
      }

      // add scene to shooting event.
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < shootingEvents.length; i++) {
        const se = shootingEvents[i];
        const scene = se.scenes.find(s => s.sceneId === sceneId);
        if (scene) {
          shootingEvent.scenes.push({ ...scene, sceneType });
          break;
        }
      }

      // filter out shooting event with only that scene as primary.
      if (sceneType === ShootingEventSceneTypes.PRIMARY) {
        [, shootingEvents] = partition(
          shootingEvents,
          se =>
            se.scenes.length === 1 &&
            se.scenes[0].sceneId === sceneId &&
            se.scenes[0].sceneType === ShootingEventSceneTypes.PRIMARY
        );
      }

      const newState = {
        ...state,
        shootingEvents
      };

      return newState;
    }

    case `${ADD_SCENE_TO_SHOOTING_EVENT}_REJECTED`: {
      return {
        ...state,
        error: `${get(action, "payload")}`
      };
    }

    case `${ADD_SCENE_TO_SHOOTING_EVENT}_FULFILLED`: {
      return state;
    }

    case SELECT_SHOOTING_EVENT:
      return {
        ...state,
        selectedShootingEventId: get(action, "payload.shootingEventId")
      };

    default:
      return state;
  }
}

/**
 * Action creators.
 */
export const getMetadata = (productionId: string, id: string) => ({
  type: GET_METADATA,
  payload: api.getMetadata({ productionId, id })
});

export const getContent = (productionId: string, id: string) => ({
  type: GET_CONTENT,
  payload: api.getContent({ productionId, id })
});

export const getCredentials = (productionId: string, id: string) => ({
  type: GET_CREDENTIALS,
  payload: api.getCredentials({ productionId, id })
});

export const getHistory = (productionId: string, id: string) => ({
  type: GET_HISTORY,
  payload: api.getHistory({ productionId, id })
});

export const switchMode = (mode: Mode) => ({
  type: SWITCH_MODE,
  payload: { mode }
});

export const scenesUpdated = (scenes: Array<ScreenplayScene>) => ({
  type: SCENES_UPDATED,
  payload: { scenes }
});

export const usersUpdated = (users: Array<ScreenplayUser>) => ({
  type: USERS_UPDATED,
  payload: { users }
});

export const cursorUpdated = (cursor: Cursor) => ({
  type: CURSOR_UPDATED,
  payload: { cursor }
});

export const filterScenes = (filter: string) => ({
  type: FILTER_SCENES,
  payload: { filter }
});

export const loadEditor = (
  status: "pending" | "fulfilled" | "rejected",
  error?: Error
) => ({
  type: `${LOAD_EDITOR}_${status.toUpperCase()}`,
  payload: { error }
});

export const selectScene = (sceneId: string, sceneCode: string) => ({
  type: SELECT_SCENE,
  payload: { sceneId, sceneCode }
});

export const lockScenes = (productionId: string, screenplayId: string) => ({
  type: LOCK_SCENES,
  payload: api.lockScenes({ productionId, screenplayId })
});

export const toggleSpellChecker = () => ({
  type: TOGGLE_SPELL_CHECKER
});

export const addToDictionary = (word: string) => ({
  type: ADD_TO_DICTIONARY,
  payload: { word }
});

export const removeFromDictionary = (word: string) => ({
  type: REMOVE_FROM_DICTIONARY,
  payload: { word }
});

export const collapseScenes = () => ({
  type: COLLAPSE_SCENES
});

export const orderBySequence = () => ({
  type: ORDER_BY_SEQUENCE
});

export const updateSelectedThreadId = (threadId?: string) => ({
  type: UPDATE_THREAD_ID,
  payload: threadId
});

export const fetchShootingEvents = (
  productionId: string,
  screenplayId: string
) => ({
  type: FETCH_SHOOTING_EVENTS,
  payload: api.listShootingEvents({ productionId, screenplayId })
});

export const selectShootingEvent = (shootingEventId: string) => ({
  type: SELECT_SHOOTING_EVENT,
  payload: { shootingEventId }
});

export const splitShootingEvent = (
  productionId: number,
  shootingEventId: string,
  splitType: ShootingEventSplitType
) => ({
  type: SPLIT_SHOOTING_EVENT,
  payload: {
    promise: api.splitShootingEvent({
      productionId,
      shootingEventId,
      splitType
    }),
    data: {
      productionId,
      shootingEventId,
      splitType
    }
  }
});

export const deleteShootingEvent = (
  productionId: number,
  shootingEventId: string
) => ({
  type: DELETE_SHOOTING_EVENT,
  payload: {
    promise: api.deleteShootingEvent({
      productionId,
      shootingEventId
    }),
    data: {
      productionId,
      shootingEventId
    }
  }
});

export const removeSceneFromShootingEvent = (
  productionId: number,
  shootingEventId: string,
  sceneId: string
) => ({
  type: REMOVE_SCENE_FROM_SHOOTING_EVENT,
  payload: {
    promise: api.removeSceneFromShootingEvent({
      productionId,
      shootingEventId,
      sceneId
    }),
    data: {
      productionId,
      shootingEventId,
      sceneId
    }
  }
});

export const addSceneToShootingEvent = (
  productionId: number,
  shootingEventId: string,
  sceneId: string,
  sceneType: ShootingEventSceneType
) => ({
  type: ADD_SCENE_TO_SHOOTING_EVENT,
  payload: {
    promise: api.addSceneToShootingEvent({
      productionId,
      shootingEventId,
      sceneId,
      sceneType
    }),
    data: {
      productionId,
      shootingEventId,
      sceneId,
      sceneType
    }
  }
});
