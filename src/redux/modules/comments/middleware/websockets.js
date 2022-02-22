// @flow
import { type Store } from "redux";
import { get } from "lodash";
import webstomp from "webstomp-client";
import SockJS from "sockjs-client";
import env from "config/env";
import { getAuthToken } from "src/helpers/auth";
import { type RootReducerState } from "src/redux/modules";
import {
  CONNECT,
  DISCONNECT,
  SUBSCRIBE,
  UNSUBSCRIBE,
  COMMENT_RECEIVED,
  type Comment
} from "src/redux/modules/comments";

const { WALKIE_API_URL } = env;

export default function createMiddleware() {
  let client: ?webstomp.Client;
  let subscription: ?{ id: string, unsubscribe: Function };

  const subscribe = (
    { dispatch }: Store<RootReducerState, GlobalFSA<*>>,
    productionId: number,
    channelId: number
  ) => {
    unsubscribe();

    const topic = `/topic/chat/${productionId}/channels/${channelId}`;
    if (client) {
      subscription = client.subscribe(topic, (msg: { body: string }) => {
        let comment: ?Comment;

        try {
          const body = JSON.parse(msg.body);
          if (body && body.type === "message" && body.message)
            comment = body.message;
        } catch (e) {
          console.log("error parsing websocket message: %o", msg, e);
        }

        if (!comment) return;

        dispatch({
          type: COMMENT_RECEIVED,
          payload: comment
        });
      });
    }
  };

  const unsubscribe = () => {
    if (subscription) subscription.unsubscribe();
    subscription = null;
  };

  const disconnect = () => {
    unsubscribe();

    if (client) client.disconnect();
    client = null;
  };

  const connect = async () => {
    disconnect();

    // eslint-disable-next-line no-undef
    const url = new URL(`${WALKIE_API_URL}/walkie/ws`);

    const token = await getAuthToken();
    url.searchParams.append("authToken", encodeURIComponent(token));

    const socket = new SockJS(url.toString());
    const stomp = webstomp.over(socket);

    return new Promise(async (resolve, reject) => {
      stomp.connect(
        {},
        success => {
          client = stomp;
          resolve();
        },
        error => reject(error)
      );
    });
  };

  return (store: Store<RootReducerState, GlobalFSA<*>>) => (
    next: Function
  ) => async (action: GlobalFSA<*>) => {
    switch (action.type) {
      case CONNECT: {
        await connect();
        return next(action);
      }

      case DISCONNECT: {
        const res = next(action);
        await disconnect();
        return res;
      }

      case SUBSCRIBE: {
        await subscribe(
          store,
          get(action, "payload.productionId"),
          get(action, "payload.channelId")
        );

        return next(action);
      }

      case UNSUBSCRIBE: {
        unsubscribe();
        return next(action);
      }

      default:
        return next(action);
    }
  };
}
