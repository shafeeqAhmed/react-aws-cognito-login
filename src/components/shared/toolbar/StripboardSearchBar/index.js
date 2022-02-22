// @flow
// import { connect } from "react-redux";
// import { type RootReducerState } from "src/redux/modules";
import { reduxForm } from "redux-form";
import { withRouter, type ContextRouter } from "react-router";
import { searchShootingEvents } from "src/redux/modules/shooting/events";
import { unselectDayEvent } from "src/redux/modules/schedule/days";
import { setStripboardSidebarMode } from "src/redux/modules/ui";
import StripboardSearchBar from "./StripboardSearchBar";

/**
 * OwnProps are injected by react router or other providers.
 */
type OwnProps = {|
  ...ContextRouter
|};

/**
 * StateProps provide a read-only view of the redux state.
 */
type StateProps = {||};

// const mapStateToProps = (state: RootReducerState): StateProps => ({});

/**
 * DispatchProps inject actions to mutate the redux state.
 */
type DispatchProps = {||};

// const mapDispatchToProps = (dispatch: GlobalDispatch<*>): DispatchProps => ({});

export type Props = {|
  ...OwnProps,
  ...StateProps,
  ...DispatchProps
|};

// TODO: Validate function is not working for some reason??
const validate = values => {
  const errors = {};
  if (!values.query) errors.query = "Required";
  return errors;
};

const onSubmit = (values, dispatch, props: Props) => {
  const { productionId, screenplayId } = props.match.params;
  if (!values.query) return false;

  // TODO: When we implement a loading indicator in the sidebar, move these
  // dispatches here:
  // Optimistic so we can show a loading UI in the search sidebar
  // dispatch(setStripboardSidebarMode("search"));
  // dispatch(unselectDayEvent());

  return dispatch(
    searchShootingEvents({
      productionId,
      screenplayId,
      name: values.query,
      limit: 10
    })
  )
    .then(() => dispatch(setStripboardSidebarMode("search")))
    .then(() => dispatch(unselectDayEvent()));
};

const reduxFormConfig = {
  form: "stripboardSearch",
  validate,
  onSubmit
};

export default withRouter(reduxForm(reduxFormConfig)(StripboardSearchBar));
