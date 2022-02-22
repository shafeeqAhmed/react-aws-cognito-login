// @flow
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { newComment } from "src/redux/modules/comments";
import getCurrentUser from "src/redux/selectors/getCurrentUser";
import type { UsersList, UserProfile } from "src/redux/modules/users";
import type { RootReducerState } from "src/redux/modules";
import NewComment from "./newComment";

type OwnProps = {
  screenplayId: string,
  onCancel: Function,
  onComment: Function,
  onFocus: Function,
  onBlur: Function
};

/**
 * StateProps provide a read-only view of the state.
 */
type StateProps = {
  +activeProductionID: ?number,
  +users: UsersList,
  +currentUser: ?UserProfile
};

function mapStateToProps(
  state: RootReducerState,
  ownProps: OwnProps
): StateProps {
  return {
    ...ownProps,
    activeProductionID: state.productions.activeProductionID,
    users: state.users.users,
    currentUser: getCurrentUser(state)
  };
}

/**
 * DispatchProps provide ways to mutate the state.
 */
type DispatchProps = {
  newComment: typeof newComment
};

const mapDispatchToProps = (dispatch: GlobalDispatch<*>): DispatchProps =>
  bindActionCreators(
    {
      newComment
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(NewComment);
export type Props = DispatchProps & StateProps & OwnProps;
