// @flow
import { createSelector } from "reselect";

const getCommentsList = state => state.comments.items;

const getUsers = state => state.users.users;

const getCommentsWithUser = createSelector(
  [getCommentsList, getUsers],
  (comments, users) => {
    const commentsList = comments.map(message => {
      const user = users[message.fromUserId];

      return {
        ...message,
        user
      };
    });

    return commentsList;
  }
);

export default getCommentsWithUser;
