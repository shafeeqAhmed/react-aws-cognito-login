// @flow
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { isEmpty, get } from "lodash";
import { withRouter, type ContextRouter } from "react-router";
import { createNewTeam } from "src/redux/modules/productions";
import NewTeamUrl from "./url";

type OwnProps = {|
  ...ContextRouter
|};

const validate = values => {
  const errors = {};
  const requiredFields = ["subdomain"];

  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = "Required";
    }
  });

  return {
    ...errors,
    _error: isEmpty(errors) ? undefined : errors
  };
};

const onSubmit = async (values, dispatch, props) => {
  const data = await dispatch(
    createNewTeam(props.newTeamName, values.subdomain)
  );
  const teamId = get(data, "value.data.id");
  props.history.push(`/${teamId}/new-production`);
};

const reduxFormConfig = {
  form: "newTeamUrlForm",
  validate,
  onSubmit
};

type StateProps = {|
  +messageError: string,
  +newTeamName: string
|};

const mapStateToProps = (state: RootReducerState): StateProps => ({
  messageError: state.auth.messageError,
  newTeamName: get(state, "productions.newTeam.name")
});

type DispatchProps = {||};

// const mapDispatchToProps = (dispatch: GlobalDispatch<*>): DispatchProps =>
//   bindActionCreators({}, dispatch);

export default withRouter(
  connect(
    mapStateToProps
    // mapDispatchToProps
  )(reduxForm(reduxFormConfig)(NewTeamUrl))
);
export type Props = {|
  ...OwnProps,
  ...StateProps,
  ...DispatchProps
|};
