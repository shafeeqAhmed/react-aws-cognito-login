// @flow
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  getInvitations,
  acceptInvitation
} from "src/redux/modules/productions";
import type { Invitation } from "src/redux/modules/productions";
import type { BrowserHistory } from "react-router";

import SetUpPassword from "./invitations";

type RouterProps = {
  +location: Location,
  +history: BrowserHistory
};

type StateProps = {
  invitations: Array<Invitation>
};

const mapStateToProps = (
  state: RootReducerState,
  props: RouterProps
): StateProps => ({
  ...props,
  isFetching: state.auth.isFetching,
  messageError: state.auth.messageError,
  invitations: state.productions.invitations.list
});

type DispatchProps = {
  getInvitations: typeof getInvitations,
  acceptInvitation: typeof acceptInvitation
};

const mapDispatchToProps = (dispatch: GlobalDispatch<*>): DispatchProps =>
  bindActionCreators(
    {
      getInvitations,
      acceptInvitation
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(SetUpPassword);

export type ReduxProps = StateProps & RouterProps & DispatchProps;
