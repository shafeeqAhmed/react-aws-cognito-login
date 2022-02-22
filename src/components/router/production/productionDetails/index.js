// @flow
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  // change,
  reduxForm,
  formValueSelector
} from "redux-form";
import { get } from "lodash";
import getProductionById from "src/redux/selectors/getProductionById";
// import {
//   toggleLeftBar,
//   toggleRightBar,
//   togglePopupMenu,
// } from 'src/redux/modules/view/actions'
import {
  editProduction,
  getProductionTypes,
  getProductionDetails
} from "src/redux/modules/productions";
import ProductionDetails from "./ProductionDetails";

type StateProps = {
  types: Array<Object>,
  isSaving: boolean,
  currencies: Array<Object>,
  saveError: boolean,
  selectedProduction: Object,
  checkType: boolean,
  currency: string,
  checkProductionName: boolean,
  checkEstimatedBudget: boolean,
  checkProductionNumber: boolean,
  checkProductionCompany: boolean,
  cognitoUser: Object
};

const mapStateToProps = (
  state: RootReducerState,
  ownProps: Object
): StateProps => {
  const selectedProduction =
    getProductionById(
      state,
      parseInt(ownProps.match.params.productionId, 10)
    ) || {};

  const { types, error, isSaving } = state.productions;

  const currencies = [
    { name: "USD", id: 1 },
    { name: "EUR", id: 2 },
    { name: "GBP", id: 3 },
    { name: "CAD", id: 4 }
  ];

  const selector = formValueSelector("editProduction");
  return {
    cognitoUser: state.auth.cognitoUser,
    types,
    isSaving,
    currencies,
    saveError: !!error,
    selectedProduction,
    checkType: selector(state, "type"),
    currency: selector(state, "currency"),
    checkProductionName: selector(state, "productionName"),
    checkEstimatedBudget: selector(state, "estimatedBudget"),
    checkProductionNumber: selector(state, "productionNumber"),
    checkProductionCompany: selector(state, "productionCompany"),
    initialValues: {
      productionName: selectedProduction.name,
      estimatedBudget: selectedProduction.budget,
      currency: selectedProduction.currency,
      productionNumber: selectedProduction.number,
      productionCompany: selectedProduction.productionCompany,
      type: get(selectedProduction, "type.id", "")
    }
  };
};

type DispatchProps = {
  editProduction: Function,
  togglePopupMenu: Function,
  changeFieldValue: Function,
  getProductionTypes: Function,
  getProductionDetails: Function
};

const mapDispatchToProps = (dispatch: GlobalDispatch<*>) => ({
  getProductionTypes: bindActionCreators(getProductionTypes, dispatch),
  getProductionDetails: bindActionCreators(getProductionDetails, dispatch),
  changeFieldValue: (field: String, value: any) => {
    // dispatch(change('editProduction', field, value))
  }
});

const onSubmit = (values, dispatch, props) => {
  const { selectedProduction } = props;
  const production = {
    budget: parseInt(values.estimatedBudget, 10),
    currency: values.currency,
    name: values.productionName,
    number: values.productionNumber,
    productionCompany: values.productionCompany,
    productionTypeId: values.type,
    year: values.year
  };
  dispatch(editProduction(selectedProduction.id, production)).then(() => {
    console.log(props);
  });
};

const validate = values => {
  const errors = {};
  const requiredFields = [
    "productionName",
    "estimatedBudget",
    "currency",
    "productionNumber",
    "productionCompany",
    "type",
    "year"
  ];

  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = "Required";
    }
  });

  return errors;
};

const reduxFormConfig = {
  onSubmit,
  validate,
  form: "editProduction",
  enableReinitialize: true
};

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm(reduxFormConfig)(ProductionDetails)
);
export type ReduxProps = StateProps & DispatchProps;
