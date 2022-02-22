// @flow
import { createSelector } from "reselect";
import { get } from "lodash";

const getCommentsList = state => state.comments.items;
const getCommentId = (state, commentId) => commentId;
const getUsers = state => state.users.users;

const listReplies = createSelector(
  [getCommentsList, getCommentId, getUsers],
  (comments, commentId, users) => {
    const comment = comments.find(c => c.id === commentId);
    const replies = get(comment, "replies", []);
    return replies.map(c => ({ ...c, user: users[c.fromUserId] }));
  }
);

export default listReplies;
