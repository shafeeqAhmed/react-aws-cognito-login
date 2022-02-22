// @flow
import MQTT from "async-mqtt";
import { get } from "lodash";
import { SELECT_PRODUCTION } from "src/redux/modules/productions";
import { SET_ACTIVE_TEAM } from "src/redux/modules/teams";
import {
  error,
  message,
  getUrl,
  GET_URL,
  CONNECT,
  DISCONNECT,
  SUBSCRIBE,
  UNSUBSCRIBE,
  MESSAGE,
  AggregatorEventRepos
} from "./";
import type { AggregatorEventPayload } from "./";
import {
  FILE_INSERTED,
  FILE_MODIFIED,
  FILE_REMOVED,
  getDownloadUrl,
  getFileByProcessId,
  type File
} from "src/redux/modules/drive";
import {
  ELEMENT_INSERTED,
  ELEMENT_MODIFIED,
  ELEMENT_REMOVED,
  type Element
} from "src/redux/modules/elements";
import {
  SOUND_INSERTED,
  SOUND_MODIFIED,
  SOUND_REMOVED,
  type Sound
} from "src/redux/modules/sounds";
import uuid from "uuid/v4";
import type { Store } from "redux";
import type { RootReducerState } from "src/redux/modules";

export default function createMiddleware() {
  // mqtt client
  let client: ?Object;

  const connect = (
    { dispatch }: Store<RootReducerState, GlobalFSA<*>>,
    url: string
  ) => {
    client = MQTT.connect(url, { clientId: uuid() });

    // client.on("close", dispatchAction(closed));
    client.on("error", err => dispatch(error(err)));
    client.on("message", (topic, body) => dispatch(message(topic, body)));
  };

  const disconnect = () => {
    const end = client && client.end();
    client = null;
    return end;
  };

  const subscribe = (topic: string) => client && client.subscribe(topic);

  const unsubscribe = (topic: string) => client && client.unsubscribe(topic);

  return (store: Store<RootReducerState, GlobalFSA<*>>) => (
    next: Function
  ) => async (action: GlobalFSA<*>) => {
    switch (action.type) {
      case SELECT_PRODUCTION: {
        const res = next(action);
        store.dispatch(getUrl(get(action, "payload.productionId")));
        // store.dispatch(getUrl(`productions/${get(action, 'payload.productionId')}`));
        return res;
      }

      case SET_ACTIVE_TEAM: {
        const res = next(action);
        // store.dispatch(getUrl(`teams/${get(action, 'payload.teamId')}`));
        return res;
      }

      case `${GET_URL}_FULFILLED`: {
        const res = next(action);

        // connect(store, action.payload.url);
        store.dispatch({
          type: CONNECT,
          payload: get(action, "payload.data")
        });

        return res;
      }

      case CONNECT: {
        await disconnect();
        await connect(store, get(action, "payload.url"));
        const res = next(action);

        store.dispatch({
          type: SUBSCRIBE,
          payload: action.payload
        });

        return res;
      }

      case DISCONNECT: {
        const res = next(action);
        await disconnect();
        return res;
      }

      case SUBSCRIBE: {
        subscribe(get(action, "payload.topic"));
        return next(action);
      }

      case UNSUBSCRIBE: {
        unsubscribe(get(action, "payload.topic"));
        return next(action);
      }

      case MESSAGE: {
        const res = next(action);

        const kind = get(action, "payload.body.kind");

        switch (kind) {
          case "aggregator_event": {
            const payload: AggregatorEventPayload = get(
              action,
              "payload.body.payload"
            );

            const topic = get(action, "payload.body.topic");
            const topics = topic.split("/");
            const productionId = parseInt(
              (topics.length > 1 && topics[1]) || "0",
              10
            );

            const { aggregateId, version, repo, event } = payload;
            const { DRIVE, ELEMENT, SOUND } = AggregatorEventRepos;

            // TODO(@olivoil): find a way to abstract this logic, so we don't have to add each type of notification
            switch (`${repo}_${event}`) {
              case `${DRIVE}_INSERT`:
                store.dispatch({
                  type: FILE_INSERTED,
                  payload: (({
                    id: aggregateId,
                    version,
                    productionId
                  }: any): File)
                });
                break;

              case `${DRIVE}_MODIFY`:
                store.dispatch({
                  type: FILE_MODIFIED,
                  payload: (({
                    id: aggregateId,
                    version,
                    productionId
                  }: any): File)
                });
                break;

              case `${DRIVE}_REMOVE`:
                store.dispatch({
                  type: FILE_REMOVED,
                  payload: (({
                    id: aggregateId,
                    version,
                    productionId
                  }: any): File)
                });
                break;

              case `${ELEMENT}_INSERT`:
                store.dispatch({
                  type: ELEMENT_INSERTED,
                  payload: (({
                    id: aggregateId,
                    version,
                    productionId
                  }: any): Element)
                });
                break;

              case `${ELEMENT}_MODIFY`:
                store.dispatch({
                  type: ELEMENT_MODIFIED,
                  payload: (({
                    id: aggregateId,
                    version,
                    productionId
                  }: any): Element)
                });
                break;

              case `${ELEMENT}_REMOVE`:
                store.dispatch({
                  type: ELEMENT_REMOVED,
                  payload: (({
                    id: aggregateId,
                    version,
                    productionId
                  }: any): Element)
                });
                break;

              case `${SOUND}_INSERT`:
                store.dispatch({
                  type: SOUND_INSERTED,
                  payload: (({
                    id: aggregateId,
                    version,
                    teamId: productionId
                  }: any): Sound)
                });
                break;

              case `${SOUND}_MODIFY`:
                store.dispatch({
                  type: SOUND_MODIFIED,
                  payload: (({
                    id: aggregateId,
                    version,
                    teamId: productionId
                  }: any): Sound)
                });
                break;

              case `${SOUND}_REMOVE`:
                store.dispatch({
                  type: SOUND_REMOVED,
                  payload: (({
                    id: aggregateId,
                    version,
                    teamId: productionId
                  }: any): Sound)
                });
                break;

              default:
                // eslint-disable-next-line no-console
                console.log(
                  "unknown event and repo in %o",
                  get(action, "payload")
                );
                break;
            }
            break;
          }

          case "batch_event": {
            const status = get(action, "payload.body.payload.status");
            const progress = get(action, "payload.body.payload.progress", 0);

            if (status === "ended" && progress === 100) {
              const processId = get(
                action,
                "payload.body.payload.processId",
                0
              );

              const state = store.getState();
              const file = getFileByProcessId(state, processId);

              if (file) {
                const todo = getDownloadUrl(
                  file.productionId,
                  file.id,
                  processId
                );

                store.dispatch(((todo: any): GlobalFSA<*>));
              }
            }

            break;
          }

          default:
            console.log("unknown event kind in %o", get(action, "payload"));
            break;
        }

        return res;
      }

      default:
        return next(action);
    }
  };
}
