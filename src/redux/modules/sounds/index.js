// @flow
import { findIndex, get } from "lodash";
import { upsert } from "src/helpers/lodash";
import { UploadStatuses, type UploadStatus } from "src/redux/modules/drive";
import type { Tag } from "src/redux/modules/tags";
import type { Production } from "src/redux/modules/productions";
import ksuid from "ksuid";
import * as api from "./api";

export * from "./selectors";

export const FETCH_SOUNDS: "procliq-web-editor/sounds/FETCH_SOUNDS" =
  "procliq-web-editor/sounds/FETCH_SOUNDS";

export const FETCH_SOUND: "procliq-web-editor/sounds/FETCH_SOUND" =
  "procliq-web-editor/sounds/FETCH_SOUND";

export const SEARCH_SOUNDS: "procliq-web-editor/sounds/SEARCH_SOUNDS" =
  "procliq-web-editor/sounds/SEARCH_SOUNDS";

export const CREATE_SOUND: "procliq-web-editor/sounds/CREATE_SOUND" =
  "procliq-web-editor/sounds/CREATE_SOUND";

export const UPDATE_SOUND: "procliq-web-editor/sounds/UPDATE_SOUND" =
  "procliq-web-editor/sounds/UPDATE_SOUND";

export const DELETE_SOUND: "procliq-web-editor/sounds/DELETE_SOUND" =
  "procliq-web-editor/sounds/DELETE_SOUND";

export const UPLOAD_SOUND: "procliq-web-editor/sounds/UPLOAD_SOUND" =
  "procliq-web-editor/sounds/UPLOAD_SOUND";

export const DISMISS_UPLOAD: "procliq-web-editor/sounds/DISMISS_UPLOAD" =
  "procliq-web-editor/sounds/DISMISS_UPLOAD";

export const GET_PLAY_URL: "procliq-web-editor/sounds/GET_PLAY_URL" =
  "procliq-web-editor/sounds/GET_PLAY_URL";

export const GET_DOWNLOAD_URL: "procliq-web-editor/sounds/GET_DOWNLOAD_URL" =
  "procliq-web-editor/sounds/GET_DOWNLOAD_URL";

export const DOWNLOAD: "procliq-web-editor/sounds/DOWNLOAD" =
  "procliq-web-editor/sounds/DOWNLOAD";

export const SOUND_INSERTED: "procliq-web-editor/sounds/SOUND_INSERTED" =
  "procliq-web-editor/sounds/SOUND_INSERTED";

export const SOUND_MODIFIED: "procliq-web-editor/sounds/SOUND_MODIFIED" =
  "procliq-web-editor/sounds/SOUND_MODIFIED";

export const SOUND_REMOVED: "procliq-web-editor/sounds/SOUND_REMOVED" =
  "procliq-web-editor/sounds/SOUND_REMOVED";

export type Upload = {|
  +soundId: string,
  +requestId?: string,
  +loaded?: number,
  +total?: number,
  +status: UploadStatus,
  +createdAt: string,
  +updatedAt: string
|};

export type Sound = {|
  +id: string,
  +version: number,
  +team_id: string,
  +team_order?: number,
  +name: string,
  +description?: string,
  +duration?: string,
  +file_name?: string,
  +file_size?: number,
  +mime_type?: string,
  +upload?: Upload,
  +play_url?: string,
  +productions: Array<{|
    +sound_id: string,
    +production_id: string,
    +production?: ?Production
  |}>,
  +tags?: Array<Tag>,
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
  +select?: Array<Sound>
|};

export type State = {|
  +list: Array<Sound>,
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
    case `${FETCH_SOUNDS}_PENDING`:
      return {
        ...state,
        isFetching: true
      };

    case `${FETCH_SOUNDS}_FULFILLED`: {
      const sounds = get(action, "payload.data.sounds", []);
      const list = sounds.reduce(
        (l, i) => upsert(l, i, sound => sound.id === i.id),
        []
      );

      return {
        ...state,
        list,
        isFetching: false,
        error: null
      };
    }

    case `${FETCH_SOUNDS}_REJECTED`:
      return {
        ...state,
        isFetching: false,
        error: action.payload
      };

    case `${FETCH_SOUND}_PENDING`:
      return {
        ...state,
        isFetching: true
      };

    case `${FETCH_SOUND}_FULFILLED`: {
      const sound = get(action, "payload.data.sound", {});
      if (!sound.id) return state;

      const list = upsert(state.list, sound, s => s.id === sound.id);

      return {
        ...state,
        list,
        isFetching: false,
        error: null
      };
    }

    case `${FETCH_SOUND}_REJECTED`:
      return {
        ...state,
        isFetching: false,
        error: action.payload
      };

    case `${SEARCH_SOUNDS}_PENDING`:
      return {
        ...state,
        isFetching: true,
        search: {
          ...state.search,
          query: { term: get(action, "meta.request.name", "") }
        }
      };

    case `${SEARCH_SOUNDS}_FULFILLED`: {
      const sounds = get(action, "payload.data.sounds", []);
      const list = sounds.reduce(
        (l, i) => upsert(l, i, sound => sound.id === i.id),
        []
      );

      // update search results if query hasn't changed.
      const results =
        state.search.query.term === get(action, "meta.request.name", "")
          ? sounds.map(s => s.id)
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

    case `${SEARCH_SOUNDS}_REJECTED`:
      return {
        ...state,
        isFetching: false,
        error: action.payload
      };

    case `${CREATE_SOUND}_PENDING`: {
      const request: api.CreateSoundRequest = get(action, "meta.request", {});
      const now = new Date().toISOString();
      const id: string = get(action, "meta.id");
      if (!id) return state;

      const sound: Sound = {
        id,
        version: 0,
        team_id: get(request, "teamId", ""),
        name: get(request, "name", ""),
        description: get(request, "description", ""),
        productions: [],
        created_by: "",
        created_at: now,
        updated_at: now,
        deleted_at: undefined
      };

      const list = upsert(state.list, sound, s => s.id === sound.id);

      return {
        ...state,
        list,
        isFetching: true
      };
    }

    case `${CREATE_SOUND}_FULFILLED`: {
      const request = get(action, "meta.request", {});
      const response: api.CreateSoundResponse = get(action, "payload.data", {});

      const now = new Date().toISOString();
      const id = get(action, "meta.id");

      const list = state.list.slice();
      const soundIndex = findIndex(list, s => s.id === id);

      if (!id || soundIndex === -1) {
        // insert
        list.push({
          id,
          version: 0,
          team_id: get(request, "teamId", ""),
          name: get(request, "name", ""),
          description: get(request, "description", ""),
          productions: get(request, "productionIds", []).map(production_id => ({
            sound_id: id,
            production_id
          })),
          created_by: "",
          created_at: now,
          updated_at: now,
          deleted_at: undefined
        });
      } else {
        // replace
        list.splice(soundIndex, 1, {
          ...list[soundIndex],
          ...response
        });
      }

      return {
        ...state,
        list,
        isFetching: false
      };
    }

    case `${CREATE_SOUND}_REJECTED`: {
      const list = state.list.slice();
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

    case `${UPDATE_SOUND}_PENDING`: {
      const list = state.list.slice();
      const id = get(action, "meta.request.soundId");
      const index = findIndex(list, c => c.id === id);
      const now = new Date().toISOString();

      const update = {
        id,
        version: list[index].version + 1,
        name: get(action, "meta.request.name", list[index].name),
        description: get(
          action,
          "meta.request.description",
          list[index].description
        ),
        updated_at: now
      };

      if (index !== -1) {
        list.splice(index, 1, {
          ...list[index],
          ...update
        });
      }

      return {
        ...state,
        list,
        isFetching: true
      };
    }

    case `${DELETE_SOUND}_PENDING`: {
      const list = state.list.slice();
      const id = get(action, "meta.request.soundId");
      const index = findIndex(list, c => c.id === id);
      const now = new Date().toISOString();

      if (index !== -1) {
        list.splice(index, 1, {
          ...list[index],
          deleted_at: now
        });
      }

      return {
        ...state,
        list,
        isFetching: true
      };
    }

    case `${DELETE_SOUND}_FULFILLED`: {
      const list = state.list.slice();
      const id = get(action, "meta.request.soundId");
      const index = findIndex(list, c => c.id === id);
      const now = new Date().toISOString();

      if (index !== -1) {
        list.splice(index, 1, {
          ...list[index],
          deleted_at: now,
          ...get(action, "payload.data")
        });
      }

      return {
        ...state,
        list,
        isFetching: false
      };
    }

    case `${DELETE_SOUND}_REJECTED`: {
      const list = state.list.slice();
      const id = get(action, "meta.request.soundId");
      const index = findIndex(list, c => c.id === id);

      if (index !== -1) {
        list.splice(index, 1, {
          ...list[index],
          deleted_at: undefined
        });
      }

      return {
        ...state,
        list,
        isFetching: false,
        error: action.payload
      };
    }

    case `${UPLOAD_SOUND}_PENDING`: {
      const request: api.CreateSoundRequest = get(action, "meta.request", {});
      const now = new Date().toISOString();
      const id: string = get(action, "meta.id");
      if (!id) return state;

      const sound: Sound = {
        id,
        version: 0,
        team_id: get(request, "teamId", ""),
        name: get(request, "name", ""),
        description: get(request, "description", ""),
        productions: [],
        upload: {
          soundId: id,
          requestId: id,
          status: UploadStatuses.PENDING,
          createdAt: now,
          updatedAt: now
        },
        created_by: "",
        created_at: now,
        updated_at: now,
        deleted_at: undefined
      };

      const list = upsert(state.list, sound, s => s.id === sound.id);

      return {
        ...state,
        list,
        isFetching: true
      };
    }

    case `${UPLOAD_SOUND}_PROGRESS`: {
      const id = get(action, "meta.id", "");
      const progress = get(action, "payload", {});
      const list = state.list.slice();
      const now = new Date().toISOString();

      const index = findIndex(
        list,
        s => s.id === id || s.id === progress.soundId
      );
      if (index === -1) return state;

      list.splice(index, 1, {
        ...list[index],
        id: progress.soundId,
        upload: {
          ...progress,
          requestId: id,
          status: UploadStatuses.UPLOADING,
          updatedAt: now
        }
      });

      return {
        ...state,
        list
      };
    }

    case `${UPLOAD_SOUND}_FULFILLED`: {
      const request = get(action, "meta.request", {});
      const requestId = get(action, "meta.id", "");
      const id = get(action, "payload.data.sound.id", "");

      const now = new Date().toISOString();

      const index = findIndex(
        state.list,
        s => s.id === id || s.id === requestId
      );

      const sound: Sound = {
        team_id: get(request, "teamId", ""),
        name: get(request, "name", ""),
        description: get(request, "description", ""),
        productions: [],
        created_by: "",
        created_at: now,
        updated_at: now,
        deleted_at: undefined,
        ...state.list[index],
        id,
        version: get(action, "payload.data.version", 1),
        upload: {
          createdAt: now,
          ...get(state.list, `[${index}].upload`, {}),
          soundId: id,
          requestId,
          status: UploadStatuses.SUCCESS,
          updatedAt: now
        }
      };

      const list = upsert(
        state.list,
        sound,
        s => s.id === sound.id || s.id === requestId
      );

      return {
        ...state,
        list
      };
    }

    case `${UPLOAD_SOUND}_REJECTED`: {
      const requestId = get(action, "meta.id", "");
      const index = findIndex(
        state.list,
        s => get(s, "upload.requestId", "") === requestId || s.id === requestId
      );
      const list = state.list.slice();

      if (index > -1) {
        list.splice(1, index);
      }

      return {
        ...state,
        list,
        error: get(action, "payload.error", "Upload failed. Please try again.")
      };
    }

    case `${GET_PLAY_URL}_FULFILLED`: {
      const request = get(action, "meta.request", {});
      const index = findIndex(state.list, s => s.id === request.soundId);
      if (index === -1) return state;

      const list = state.list.slice();
      list.splice(index, 1, {
        ...list[index],
        play_url: get(action, "payload.data.url", list[index].play_url)
      });

      return {
        ...state,
        list
      };
    }

    case DISMISS_UPLOAD: {
      const { soundId } = get(action, "meta.request", {});
      const index = findIndex(state.list, s => s.id === soundId);
      if (index === -1) return state;

      const list = state.list.slice();
      list.splice(index, 1, {
        ...list[index],
        upload: undefined
      });

      return {
        ...state,
        list
      };
    }

    default:
      return state;
  }
}

export const fetchSounds = (request: api.ListSoundsRequest) => ({
  type: FETCH_SOUNDS,
  payload: api.listSounds(request),
  meta: { request }
});

export const fetchSound = (request: api.GetMetadataRequest) => ({
  type: FETCH_SOUND,
  payload: api.getMetadata(request),
  meta: { request }
});

export const createSound = (request: api.CreateSoundRequest) => ({
  type: CREATE_SOUND,
  payload: api.createSound(request),
  meta: {
    request,
    id: ksuid.randomSync().string
  }
});

export const updateSound = (request: api.UpdateSoundRequest) => ({
  type: UPDATE_SOUND,
  payload: api.updateSound(request),
  meta: { request }
});

export const deleteSound = (request: api.DeleteSoundRequest) => ({
  type: DELETE_SOUND,
  payload: api.deleteSound(request),
  meta: {
    request
  }
});

export const getPlayUrl = (request: api.GetPlayUrlRequest) => ({
  type: GET_PLAY_URL,
  payload: api.getPlayUrl(request),
  meta: {
    request
  }
});

export const searchSounds = (request: api.ListSoundsRequest) => ({
  type: SEARCH_SOUNDS,
  payload: api.listSounds(request),
  meta: { request }
});

export const uploadSound = (request: api.UploadSoundRequest) => (
  dispatch: Function
) => {
  const id = ksuid.randomSync().string;

  dispatch({
    type: UPLOAD_SOUND,
    payload: api.uploadSound({
      ...request,
      onUploadProgress: (soundId: string, loaded: number, total: number) =>
        dispatch({
          type: `${UPLOAD_SOUND}_PROGRESS`,
          payload: { soundId, loaded, total },
          meta: { request, id }
        })
    }),
    meta: { request, id }
  });
};

// requests a download url from api, and triggers downloading the file in browser
export const downloadSounds = (request: api.GetDownloadUrlRequest) => ({
  type: GET_DOWNLOAD_URL,
  payload: api.getDownloadUrl(request),
  meta: { request }
});

// triggered by epic when GET_DOWNLOAD_URL_FULFILLED triggered
// action handled in a middleware to trigger actual download in browser
export const downloadFromUrl = (request: api.GetDownloadUrlResponse) => ({
  type: DOWNLOAD,
  payload: null,
  meta: { request }
});

export const dismissUpload = (request: { soundId: string }) => ({
  type: DISMISS_UPLOAD,
  payload: null,
  meta: { request }
});
