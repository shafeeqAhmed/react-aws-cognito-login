// @flow
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { get, isEmpty, kebabCase } from "lodash";
import { withRouter, type ContextRouter } from "react-router";
// import { bindActionCreators } from "redux";
import { createNewTeam } from "src/redux/modules/productions";
import NewTeamName from "./name";

const validate = values => {
  const errors = {};
  const requiredFields = ["teamName"];

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
    createNewTeam(values.teamName, kebabCase(values.teamName))
  );
  const teamId = get(data, "value.data.team.id");
  props.history.push(`/${teamId}/new-production`);

  // dispatch(setNewTeamName(values.teamName)).then(() =>
  //   props.history.push("/new-team/url")
  // );
};

const reduxFormConfig = {
  form: "newTeamNameForm",
  validate,
  onSubmit
};

type OwnProps = {|
  ...ContextRouter
|};

type StateProps = {|
  +isFetching: boolean,
  +messageError: string
|};

const mapStateToProps = (state: RootReducerState): StateProps => ({
  isFetching: state.auth.isFetching,
  messageError: state.auth.messageError
});

type DispatchProps = {||};

// const mapDispatchToProps = (dispatch: GlobalDispatch<*>): DispatchProps =>
//   bindActionCreators({}, dispatch);

export default withRouter(
  connect(
    mapStateToProps
    // mapDispatchToProps
  )(reduxForm(reduxFormConfig)(NewTeamName))
);
export type ReduxProps = {|
  ...OwnProps,
  ...StateProps,
  ...DispatchProps
|};
