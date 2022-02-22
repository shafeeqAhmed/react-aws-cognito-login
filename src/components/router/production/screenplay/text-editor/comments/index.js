// @flow
import { connect as connectRedux } from "react-redux";
import { bindActionCreators } from "redux";
import {
  type Comment,
  getComments,
  getCommentsWithUser,
  toggleAddingNewComment,
  connectAndSubscribe,
  disconnect
} from "src/redux/modules/comments";
import { updateSelectedThreadId } from "src/redux/modules/screenplay";
import type { RootReducerState } from "src/redux/modules";
import CM from "codemirror";
import Comments from "./comments";

type OwnProps = {
  mirror: CM,
  pad: Object,
  screenplayId: string,
  screenplayThreads: Array<{
    id: string,
    line: number,
    ch: number
  }>,
  showComments: boolean
};

/**
 * StateProps provide a read-only view of the state.
 */
type StateProps = {
  productionId: ?number,
  comments: Array<Comment>,
  selectedThreadId: ?string,
  isAddingNewComment: boolean
};

function mapStateToProps(
  state: RootReducerState,
  ownProps: OwnProps
): StateProps {
  return {
    ...ownProps,
    productionId: state.productions.activeProductionID,
    comments: getCommentsWithUser(state),
    selectedThreadId: state.screenplay.selectedThreadId,
    isAddingNewComment: state.comments.isAddingNewComment
  };
}

/**
 * DispatchProps provide ways to mutate the state.
 */
type DispatchProps = {
  getComments: typeof getComments,
  updateSelectedThreadId: typeof updateSelectedThreadId,
  toggleAddingNewComment: typeof toggleAddingNewComment,
  disconnect: typeof disconnect,
  connectAndSubscribe: typeof connectAndSubscribe
};

const mapDispatchToProps = (dispatch: GlobalDispatch<*>): DispatchProps =>
  bindActionCreators(
    {
      getComments,
      updateSelectedThreadId,
      toggleAddingNewComment,
      disconnect,
      connectAndSubscribe
    },
    dispatch
  );

export default connectRedux(mapStateToProps, mapDispatchToProps)(Comments);
export type Props = OwnProps & StateProps & DispatchProps;
