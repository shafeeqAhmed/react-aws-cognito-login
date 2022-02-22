// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from "react";
import { Field } from "redux-form";
import TextField from "./textField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import css from "./url.style.css";
import { type Props } from "./";

export default class NewTeamUrl extends PureComponent<Props> {
  subdomainInput = React.createRef();
  render() {
    const {
      messageError,
      valid,
      pristine,
      handleSubmit,
      submitting,
      asyncValidating
    } = this.props;

    const labelStyle = {
      fontSize: 20,
      color: "#848484",
      top: 28
    };

    const inputStyle = {
      fontWeight: 500,
      height: 45,
      fontSize: 20
    };

    return (
      <form id="newTeamUrlForm" className={css.content} onSubmit={handleSubmit}>
        <div className={css.fieldContainer}>
          <Field
            withRef
            ref={this.subdomainInput}
            id="subdomain"
            name="subdomain"
            component={TextField}
            type="text"
            fullWidth
            style={inputStyle}
            labelStyle={labelStyle}
            errorClassName={css.errorInput}
            classes={{
              underline: css.underline,
              input: css.input
            }}
            startAdornment={
              <InputAdornment
                position="start"
                disableTypography
                classes={{
                  positionStart: css.positionStart
                }}
              >
                productioncliq.com/
              </InputAdornment>
            }
          />
        </div>
        <div className={css.helpText}>
          Your team’s web address on ProductionCliq
        </div>
        <div className={css.messageError}>{messageError || null}</div>
        <Button
          type="submit"
          disableRipple
          disabled={!valid || pristine}
          classes={{
            root: css.nextButton,
            disabled: css.nextButtonDisabled
          }}
        >
          {submitting || asyncValidating ? "Submitting..." : "Next"}
        </Button>
      </form>
    );
  }
}
