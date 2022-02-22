// @flow
import { get } from "lodash";
import { camelize } from "src/helpers/api";
import * as api from "./api";

/**
 * Action types.
 */
export const GET_URL: "procliq-editor-web/notifications/GET_URL" =
  "procliq-editor-web/notifications/GET_URL";

export const CONNECT: "procliq-editor-web/notifications/CONNECT" =
  "procliq-editor-web/notifications/CONNECT";

export const DISCONNECT: "procliq-editor-web/notifications/DISCONNECT" =
  "procliq-editor-web/notifications/DISCONNECT";

export const SUBSCRIBE: "procliq-editor-web/notifications/SUBSCRIBE" =
  "procliq-editor-web/notifications/SUBSCRIBE";

export const UNSUBSCRIBE: "procliq-editor-web/notifications/UNSUBSCRIBE" =
  "procliq-editor-web/notifications/UNSUBSCRIBE";

export const MESSAGE: "procliq-editor-web/notifications/MESSAGE" =
  "procliq-editor-web/notifications/MESSAGE";

export const ERROR: "procliq-editor-web/notifications/ERROR" =
  "procliq-editor-web/notifications/ERROR";

/**
 * State definition.
 */
export const AggregatorEventTypes = {
  INSERT: ("INSERTED": "INSERTED"),
  MODIFY: ("MODIFIED": "MODIFIED"),
  REMOVE: ("REMOVED": "REMOVED")
};

export type AggregatorEventType = $Values<typeof AggregatorEventTypes>;

export const AggregatorEventRepos = {
  SHOOTING_EVENT: ("shootingevents": "shootingevents"),
  SCREENPLAY: ("screenplays": "screenplays"),
  SCENE: ("scenes": "scenes"),
  DRIVE: ("files": "files"),
  UNIT: ("units": "units"),
  ELEMENT: ("elements": "elements"),
  SOUND: ("sounds": "sounds")
};

export type AggregatorEventRepo = $Values<typeof AggregatorEventRepos>;

export type AggregatorEventPayload = {
  repo: AggregatorEventRepo,
  event: AggregatorEventType,
  aggregateId: string,
  version: number
};

export type AggregatorEvent = {
  kind: string,
  topic: string,
  payload: AggregatorEventPayload
};

export type Message = {
  topic: string,
  body: AggregatorEvent
};

export type State = {
  +productionId: ?string,
  +url: ?string,
  +topic: ?string,
  +messages: Array<Message>,
  +error: ?string
};

const initialState: State = {
  productionId: undefined,
  url: undefined,
  topic: undefined,
  messages: [],
  error: undefined
};

/**
 * Reducer.
 */
export default function reducer(
  state: State = initialState,
  action: GlobalFSA<*>
): State {
  switch (action.type) {
    case `${GET_URL}_PENDING`:
      return {
        ...state,
        isConnecting: true
      };

    case `${GET_URL}_FULFILLED`: {
      return {
        ...state,
        productionId: get(action, "payload.data.productionId"),
        url: get(action, "payload.data.url"),
        topic: get(action, "payload.data.topic"),
        isConnecting: false,
        error: undefined
      };
    }

    case `${GET_URL}_REJECTED`:
      return {
        ...state,
        error: action.payload,
        isConnecting: false
      };

    // TODO: dispatch messages from the middleware to the right redux store actions?
    case MESSAGE:
      return {
        ...state,
        messages: action.payload
          ? [...state.messages, action.payload]
          : state.messages
      };

    case ERROR:
      return {
        ...state,
        error: action.payload
      };

    default:
      return state;
  }
}

/**
 * Action creators.
 */
export const getUrl = (productionId: string) => ({
  type: GET_URL,
  payload: api.getUrl({ productionId })
});

export const connect = (url: string) => ({
  type: CONNECT,
  payload: { url }
});

export const disconnect = () => ({
  type: DISCONNECT
});

export const error = (err: Error) => ({
  type: ERROR,
  payload: err
});

export const subscribe = (topic: string) => ({
  type: SUBSCRIBE,
  payload: { topic }
});

export const unsubscribe = (topic?: string) => ({
  type: UNSUBSCRIBE,
  payload: { topic }
});

export const message = (topic: string, body: Buffer) => ({
  type: MESSAGE,
  payload: { topic, body: camelize(JSON.parse(body.toString())) }
});
