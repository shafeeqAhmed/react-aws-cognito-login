// @flow
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateSelectedThreadId } from "src/redux/modules/screenplay";
import {
  fetchReplies,
  reply,
  listReplies,
  type Comment
} from "src/redux/modules/comments";
import {
  getCurrentUser,
  type UsersList,
  type UserProfile
} from "src/redux/modules/users";
import { type RootReducerState } from "src/redux/modules";
import Component from "./comment";

type OwnProps = {
  +comment: Comment,
  +position: number,
  +onFocus: Function,
  +onBlur: Function,
  +selectedThreadId: ?string
};

/**
 * StateProps provide a read-only view of the state.
 */
type StateProps = {
  +users: UsersList,
  +replies: Array<Comment>,
  +currentUser: ?UserProfile
};

function mapStateToProps(
  state: RootReducerState,
  ownProps: OwnProps
): StateProps {
  return {
    users: state.users.users,
    replies: listReplies(state, ownProps.comment.id),
    currentUser: getCurrentUser(state),
    ...ownProps
  };
}

/**
 * DispatchProps provide ways to mutate the state.
 */
type DispatchProps = {
  +updateSelectedThreadId: typeof updateSelectedThreadId,
  +fetchReplies: typeof fetchReplies,
  +reply: typeof reply
};

const mapDispatchToProps = (dispatch: GlobalDispatch<*>): DispatchProps =>
  bindActionCreators(
    {
      updateSelectedThreadId,
      fetchReplies,
      reply
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Component);
export type Props = OwnProps & StateProps & DispatchProps;
