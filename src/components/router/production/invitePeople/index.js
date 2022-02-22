// @flow
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { withRouter } from "react-router";
import { bindActionCreators } from "redux";
import { getContacts } from "src/redux/modules/users";
import type { ContactsList } from "src/redux/modules/users";
import InvitePeople from "./invitePeople";

type StateProps = {
  +isFetching: boolean,
  +error: ?string,
  +contacts: ContactsList
};

type FormProps = {};

const mapStateToProps = (
  state: RootReducerState,
  props: FormProps
): StateProps => ({
  ...props,
  isFetching: state.users.invitePeople.isFetching,
  contacts: state.users.invitePeople.contacts,
  error: state.users.invitePeople.error
});

type DispatchProps = {
  getContacts: typeof getContacts
};

const reduxFormConfig = {
  form: "invitePeople"
};

const mapDispatchToProps = (dispatch: GlobalDispatch<*>): DispatchProps =>
  bindActionCreators(
    {
      getContacts
    },
    dispatch
  );

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(
    reduxForm(reduxFormConfig)(InvitePeople)
  )
);
export type ReduxProps = StateProps & FormProps & DispatchProps;
