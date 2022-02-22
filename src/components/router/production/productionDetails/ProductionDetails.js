// @flow
import React, { PureComponent } from "react";
import { Field } from "redux-form";
import { get } from "lodash";
import MenuItem from "material-ui/MenuItem";
import $ from "config/variables";
import phoneImg from "static/images/phone.png";
import logoImg from "static/images/logo2_lg_procliq.png";
import TextField from "src/components/shared/TextField";
import SelectField from "src/components/shared/SelectField";
import img from "src/styles/images.css";
import css from "./ProductionDetails.style.css";
import type { ReduxProps } from "./";

type Props = ReduxProps & {
  location: Object,
  match: Object,
  history: Object,
  handleSubmit: Function
};

const fieldStyle = {
  color: $.colorWhite,
  labelColor: $.colorWhiteFaded,
  textTransform: "capitalize",
  fullWidth: true,
  underlineStyle: $.colorWhiteFaded,
  underlineFocusStyle: $.colorWhite
};

class ProductionDetails extends PureComponent<Props> {
  componentWillMount = () => {
    const {
      getProductionTypes,
      getProductionDetails,
      match,
      cognitoUser
    } = this.props;

    if (cognitoUser) {
      getProductionTypes();
      getProductionDetails(match.params.productionId);
    }
  };

  componentWillReceiveProps(nextProps: Props) {
    const {
      getProductionTypes,
      getProductionDetails,
      match,
      cognitoUser
    } = this.props;

    if (!cognitoUser && nextProps.cognitoUser) {
      getProductionTypes();
      getProductionDetails(match.params.productionId);
    }
  }

  showProductionsTypes = () => {
    const { types } = this.props;

    return (
      types &&
      types.map(item => (
        <MenuItem key={item.id} value={item.id} primaryText={item.name} />
      ))
    );
  };

  showProductionsTypes: Function;

  props: Props;

  render() {
    const {
      checkType,
      handleSubmit,
      selectedProduction,
      checkProductionName,
      checkEstimatedBudget,
      checkProductionNumber,
      checkProductionCompany
    } = this.props;

    const number = value =>
      value && isNaN(Number(value)) ? "Must be a number" : undefined;

    const poster = get(selectedProduction, "poster.urls", null);
    const avatar =
      poster && poster[0] ? (
        <div
          className={css.avatar}
          style={{ backgroundImage: `url(${poster[0]}` }}
        />
      ) : (
        <i className={`material-icons ${css.avatarDefault}`}>photo_album</i>
      );

    return (
      <div className={css.container}>
        <div className={css.leftSide}>
          <div className={css.formAndLogo}>
            <img src={logoImg} alt={"ProCliq"} className={css.logo2} />
            <div className={css.form}>
              <h1 className={css.title}>Edit a Production</h1>
              <div className={css.uploadImage}>
                {avatar}
                <p className={css.uploadImageText}>Poster or Image</p>
              </div>
              <div className={css.input}>
                <div className={css.approveImage}>
                  {checkProductionName && (
                    <i className={`material-icons ${css.icon}`}>check</i>
                  )}
                </div>
                <div className={css.inputLeft}>
                  <Field
                    type="text"
                    name={"productionName"}
                    component={TextField}
                    label={"Production Name"}
                    {...fieldStyle}
                  />
                </div>
                <div className={css.inputRight} />
              </div>
              <div className={css.input}>
                <div className={css.approveImage}>
                  {checkEstimatedBudget && (
                    <i className={`material-icons ${css.icon}`}>check</i>
                  )}
                </div>
                <div className={css.inputLeft}>
                  <Field
                    type="text"
                    name={"estimatedBudget"}
                    label={"Estimated Budget"}
                    validate={number}
                    component={TextField}
                    {...fieldStyle}
                  />
                </div>
                <div className={css.inputRight}>
                  <Field
                    type="select"
                    name={"currency"}
                    label={"Currency"}
                    component={SelectField}
                    {...fieldStyle}
                  >
                    <MenuItem value={"USD"} primaryText="USD" />
                    <MenuItem value={"EUR"} primaryText="EUR" />
                  </Field>
                </div>
              </div>
              <div className={css.input}>
                <div className={css.approveImage}>
                  {checkProductionNumber && (
                    <i className={`material-icons ${css.icon}`}>check</i>
                  )}
                </div>
                <div className={css.inputLeft}>
                  <Field
                    type="text"
                    name={"productionNumber"}
                    label={"Production Number"}
                    validate={number}
                    component={TextField}
                    {...fieldStyle}
                  />
                </div>
                <div className={css.inputRight}>
                  <Field
                    type="number"
                    name={"year"}
                    label={"Year"}
                    validate={number}
                    component={TextField}
                    {...fieldStyle}
                  />
                </div>
              </div>
              <div className={css.input}>
                <div className={css.approveImage}>
                  {checkProductionCompany && (
                    <i className={`material-icons ${css.icon}`}>check</i>
                  )}
                </div>
                <div className={css.inputLeft}>
                  <Field
                    type="text"
                    name={"productionCompany"}
                    label={"Production Company"}
                    component={TextField}
                    {...fieldStyle}
                  />
                </div>
                <div className={css.inputRight} />
              </div>
              <div className={css.input}>
                <div className={css.approveImage}>
                  {checkType && (
                    <i className={`material-icons ${css.icon}`}>check</i>
                  )}
                </div>
                <div className={css.inputLeft}>
                  <Field
                    type="select"
                    name={"type"}
                    label={"Production type"}
                    component={SelectField}
                    {...fieldStyle}
                  >
                    {this.showProductionsTypes()}
                  </Field>
                </div>
                <div className={css.inputRight} />
              </div>
            </div>
          </div>
          <div>
            <button className={css.button} onClick={handleSubmit}>
              <i className={`material-icons ${css.icon}`}>check</i>
              <span className={css.cancelText}>Next</span>
            </button>
          </div>
        </div>
        <div className={css.rightSide}>
          <div className={css.topSide}>
            <button
              className={css.button}
              onClick={() => this.props.history.goBack()}
            >
              <i className={`material-icons ${css.icon}`}>close</i>
              <span className={css.cancelText}>Cancel</span>
            </button>
          </div>
          <div className={css.rightBottomSide}>
            <img
              src={phoneImg}
              alt={"Phone Imagen"}
              className={css.phoneImage}
            />
          </div>
          <div className={css.bottomBox} />
        </div>
      </div>
    );
  }
}

export default ProductionDetails;
