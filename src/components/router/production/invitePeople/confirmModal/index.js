// @flow
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import { sendInvitations } from "src/redux/modules/productions";
import type { Match } from "src/helpers/router/route";
import type { RouterHistory } from "react-router";
import ConfirmModal from "./confirmModal";

type StateProps = {
  +isFetching: boolean,
  +error: boolean
};

type OwnProps = {
  history: RouterHistory,
  match: Match<{ productionId: string }>
};

const mapStateToProps = (
  state: RootReducerState,
  props: OwnProps
): StateProps => ({
  ...props,
  isFetching: state.productions.invitations.isFetching,
  error: state.productions.invitations.error
});

type DispatchProps = {
  sendInvitations: Function
};

const mapDispatchToProps = (dispatch: GlobalDispatch<*>): DispatchProps =>
  bindActionCreators(
    {
      sendInvitations
    },
    dispatch
  );

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ConfirmModal)
);
export type ReduxProps = StateProps & OwnProps & DispatchProps;
