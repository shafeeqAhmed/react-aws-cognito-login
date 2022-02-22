// @flow
import { findIndex, get } from "lodash";
import ksuid from "ksuid";
import * as api from "./api";
import { type UserProfile } from "src/redux/modules/users";
import { type RootReducerState } from "src/redux/modules/index";
import { upsert } from "src/helpers/lodash";

export * from "./selectors";

export const NEW_COMMENT: "procliq-web-editor/comments/NEW_COMMENT" =
  "procliq-web-editor/comments/NEW_COMMENT";
export const REPLY: "procliq-web-editor/comments/REPLY" =
  "procliq-web-editor/comments/REPLY";
export const FETCH_COMMENTS: "procliq-web-editor/comments/FETCH_COMMENTS" =
  "procliq-web-editor/comments/FETCH_COMMENTS";
export const FETCH_REPLIES: "procliq-web-editor/comments/FETCH_REPLIES" =
  "procliq-web-editor/comments/FETCH_REPLIES";
export const TOGGLE_ADDING_NEW_COMMENT: "procliq-web-editor/comments/TOGGLE_ADDING_NEW_COMMENT" =
  "procliq-web-editor/comments/TOGGLE_ADDING_NEW_COMMENT";
export const CONNECT: "procliq-web-editor/comments/CONNECT" =
  "procliq-web-editor/comments/CONNECT";
export const DISCONNECT: "procliq-web-editor/comments/DISCONNECT" =
  "procliq-web-editor/comments/DISCONNECT";
export const SUBSCRIBE: "procliq-web-editor/comments/SUBSCRIBE" =
  "procliq-web-editor/comments/SUBSCRIBE";
export const UNSUBSCRIBE: "procliq-web-editor/comments/UNSUBSCRIBE" =
  "procliq-web-editor/comments/UNSUBSCRIBE";
export const COMMENT_RECEIVED: "procliq-web-editor/comments/COMMENT_RECEIVED" =
  "procliq-web-editor/comments/COMMENT_RECEIVED";

export type Channel = {
  +id: number
};

export const ThreadStatuses = {
  OPENED: ("OPENED": "OPENED"),
  RESOLVED: ("RESOLVED": "RESOLVED")
};

export type ThreadStatus = $Values<typeof ThreadStatuses>;

export type Comment = {
  +id: number,
  +fromUserId: string,
  +toChatId: number,
  +toThreadId?: number,
  +message: string,
  +time: string,
  +thread?: {
    +replies: number,
    +status: ThreadStatus,
    +topics?: ?Array<string>
  },
  +user?: UserProfile,
  +replies?: Array<Comment>
};

export type State = {
  +items: Array<Comment>,
  +error: ?string,
  +isFetching: boolean,
  +nextOffset?: number,
  +isAddingNewComment: boolean
};

export const initialState: State = {
  items: [],
  error: "",
  isFetching: false,
  isAddingNewComment: false
};

export default function reducer(
  state: State = initialState,
  action: GlobalFSA<*>
) {
  switch (action.type) {
    case `${FETCH_COMMENTS}_PENDING`:
      return {
        ...state,
        isFetching: true
      };

    case `${FETCH_COMMENTS}_FULFILLED`: {
      const items = get(action, "payload.data.comments").reverse();

      return {
        ...state,
        isFetching: false,
        items
      };
    }

    case `${FETCH_COMMENTS}_REJECTED`:
      return {
        ...state,
        isFetching: false,
        error: action.payload
      };

    case `${FETCH_REPLIES}_PENDING`:
      return {
        ...state,
        isFetching: true
      };

    case `${FETCH_REPLIES}_FULFILLED`: {
      const items = [...state.items];
      const index = findIndex(
        items,
        c => c.id === get(action, "meta.input.threadId")
      );

      if (index > -1) {
        items.splice(index, 1, {
          ...items[index],
          replies: get(action, "payload.data.comments").reverse()
        });
      }

      return {
        ...state,
        isFetching: false,
        items
      };
    }

    case `${FETCH_REPLIES}_REJECTED`:
      return {
        ...state,
        isFetching: false,
        error: action.payload
      };

    case `${REPLY}_PENDING`:
      return state;

    case `${REPLY}_FULFILLED`: {
      const { threadId } = get(action, "meta.input", {});

      const items = [...state.items];
      const index = findIndex(items, c => c.id === threadId);
      if (index === -1) return state;

      const reply = get(action, "payload.data.reply", {});
      const replies = upsert(
        get(items[index], "replies", []),
        reply,
        r => r.id === reply.id
      );

      items.splice(index, 1, {
        ...items[index],
        thread: {
          ...get(items[index], "thread", { replies: 0 }),
          replies: get(items[index], "thread.replies", 0) + 1
        },
        replies
      });

      return {
        ...state,
        items
      };
    }

    case `${REPLY}_REJECTED`:
      return {
        ...state,
        isFetching: false,
        error: action.payload
      };

    case `${NEW_COMMENT}_PENDING`:
      return state;

    case `${NEW_COMMENT}_FULFILLED`: {
      const comment = get(action, "payload.data.message");
      const items = upsert(state.items, comment, c => c.id === comment.id);

      return {
        ...state,
        isFetching: false,
        items
      };
    }

    case `${NEW_COMMENT}_REJECTED`: {
      // TODO: show error

      return {
        ...state,
        isFetching: false
      };
    }

    case COMMENT_RECEIVED: {
      // console.log(COMMENT_RECEIVED, action);

      const comment = get(action, "payload", {});
      if (!comment || !get(comment, "id")) return state;

      let items = [...state.items];

      if (comment.toThreadId) {
        // comment is a reply.
        const index = findIndex(items, c => c.id === comment.toThreadId);
        if (index === -1) return state;

        let item = { ...items[index] };

        const replies = get(items[index], "replies", []);
        const replyIndex = findIndex(replies, c => c.id === comment.id);

        if (replyIndex === -1) {
          replies.push(comment);
          const thread = { ...get(item, "thread", { replies: 0 }) };
          thread.replies += 1;
          item = { ...item, thread };
        } else {
          replies.splice(replyIndex, 1, comment);
        }

        item = { ...item, replies };
        items.splice(index, 1, item);
      } else {
        // comment is a top-level comment.
        const index = findIndex(items, c => c.id === comment.id);

        if (index === -1) {
          items = [...items, comment];
        } else {
          items.splice(index, 1, comment);
        }
      }

      return {
        ...state,
        items
      };
    }

    case TOGGLE_ADDING_NEW_COMMENT: {
      return {
        ...state,
        isAddingNewComment: !!action.payload
      };
    }

    default:
      return state;
  }
}

export const fetchReplies = (
  threadId: number,
  productionId?: number,
  screenplayId?: string
) => async (dispatch: Function, getState: () => RootReducerState) => {
  if (!productionId || !screenplayId) {
    const state = getState();

    if (!productionId) {
      // eslint-disable-next-line no-param-reassign
      productionId = get(state, "productions.activeProductionID");
    }

    if (!screenplayId) {
      // eslint-disable-next-line no-param-reassign
      screenplayId = get(state, "screenplay.screenplay.metadata.id");
    }
  }

  const res = await api.getChannel({ productionId, screenplayId });
  const channelId = get(res, "data.channel.id", 0);

  return dispatch({
    type: FETCH_REPLIES,
    payload: api.listComments({ productionId, channelId, threadId }),
    meta: {
      input: { productionId, channelId, threadId }
    }
  });
};

export const getComments = (
  productionId: number,
  screenplayId: string
) => async (dispatch: Function) => {
  const res = await api.getChannel({ productionId, screenplayId });
  const channelId = get(res, "data.channel.id", 0);

  return dispatch({
    type: FETCH_COMMENTS,
    payload: api.listComments({ productionId, channelId }),
    meta: {
      input: { productionId, channelId }
    }
  });
};

export const newComment = (
  productionId: number,
  screenplayId: string,
  message: string
) => async (dispatch: any, getState: any) => {
  const state = getState();
  const date = new Date();

  // get channel ID
  const res = await api.getChannel({ productionId, screenplayId });
  const channelId = get(res, "data.channel.id", 0);

  const newCommentObj = {
    id: `pending-${date.toString()}`,
    pending: true,
    time: date,
    fromUserId: state.users.currentUserId,
    toChatId: channelId,
    audio: false,
    channelId,
    message
  };

  return dispatch({
    type: NEW_COMMENT,
    payload: api.newComment({
      productionId,
      channelId,
      message
    }),
    meta: {
      input: {
        comment: newCommentObj
      }
    }
  });
};

export const reply = (
  threadId: number,
  message: string,
  productionId?: number,
  screenplayId?: string
) => async (dispatch: Function, getState: () => RootReducerState) => {
  const state = getState();
  const time = new Date();

  if (!productionId)
    // eslint-disable-next-line no-param-reassign
    productionId = get(state, "productions.activeProductionID");
  if (!screenplayId)
    // eslint-disable-next-line no-param-reassign
    screenplayId = get(state, "screenplay.screenplay.metadata.id");

  // get channel ID
  const res = await api.getChannel({ productionId, screenplayId });
  const channelId = get(res, "data.channel.id", 0);

  return dispatch({
    type: REPLY,
    payload: api.createReply({
      productionId,
      threadId,
      channelId,
      message
    }),
    meta: {
      input: { productionId, threadId, channelId, message },
      id: ksuid.randomSync().string,
      fromUserId: state.users.currentUserId,
      time
    }
  });
};

export const toggleAddingNewComment = (isAdding: boolean) => ({
  type: TOGGLE_ADDING_NEW_COMMENT,
  payload: isAdding
});

export const connect = () => ({
  type: CONNECT
});

export const subscribe = (productionId: number, screenplayId: string) => async (
  dispatch: Function,
  getState: () => RootReducerState
) => {
  const res = await api.getChannel({ productionId, screenplayId });
  const channelId = get(res, "data.channel.id", 0);

  return dispatch({
    type: SUBSCRIBE,
    payload: { productionId, channelId }
  });
};

export const connectAndSubscribe = (
  productionId: number,
  screenplayId: string
) => async (dispatch: Function) => {
  await dispatch(connect());
  return dispatch(subscribe(productionId, screenplayId));
};

export const unsubscribe = () => ({
  type: UNSUBSCRIBE
});

export const disconnect = () => ({
  type: DISCONNECT
});
