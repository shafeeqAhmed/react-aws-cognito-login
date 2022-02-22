// @flow
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { isEmpty, get } from "lodash";
import { withRouter, type ContextRouter } from "react-router";
import { bindActionCreators } from "redux";
import {
  getProductionTypes,
  createNewProduction,
  setProductionPoster
} from "src/redux/modules/productions";
import type { ProductionType } from "src/redux/modules/productions";
import type { Match } from "src/helpers/router/route";
import NewProduction from "./newProduction";

const validate = values => {
  const errors = {};
  const requiredFields = ["name", "number", "year", "productionTypeId"];

  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = "Required";
    }
  });

  if (values.year < 2017) {
    errors.year = "Invalid Year";
  }

  return {
    ...errors,
    _error: isEmpty(errors) ? undefined : errors
  };
};

const onSubmit = async (values, dispatch, props) => {
  const teamId = get(props, "match.params.teamId", undefined);
  const poster = get(values, "poster");
  const data = await dispatch(
    createNewProduction(
      teamId,
      values.name,
      values.year,
      values.number,
      values.productionTypeId
    )
  );

  const productionId = get(data, "value.data.production.id");
  await dispatch(setProductionPoster({ productionId, poster }));
  props.history.push(`/${productionId}/drive`);
};

const reduxFormConfig = {
  form: "newProductionForm",
  enableReinitialize: true,
  validate,
  onSubmit
};

type StateProps = {|
  +isFetching: boolean,
  +messageError: string,
  +types: Array<ProductionType>,
  +newTeamId: ?number
|};

type OwnProps = {|
  ...ContextRouter,
  +match: Match<{ teamId: string }>
|};

const mapStateToProps = (state: RootReducerState): StateProps => ({
  isFetching: state.auth.isFetching,
  messageError: state.auth.messageErrorm,
  types: state.productions.types,
  newTeamId: state.productions.newTeam ? state.productions.newTeam.id : null
});

type DispatchProps = {|
  getProductionTypes: typeof getProductionTypes,
  createNewProduction: typeof createNewProduction
|};

const mapDispatchToProps = (dispatch: GlobalDispatch<*>): DispatchProps =>
  bindActionCreators(
    {
      getProductionTypes,
      createNewProduction
    },
    dispatch
  );

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(
    reduxForm(reduxFormConfig)(NewProduction)
  )
);
export type Props = {|
  ...OwnProps,
  ...StateProps,
  ...DispatchProps
|};
