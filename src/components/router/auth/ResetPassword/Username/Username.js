// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from "react";
import { Field } from "redux-form";
import TextField from "src/components/shared/TextField";
import Button from "@material-ui/core/Button";
import rightBackground from "static/images/invitationsBackground.png";
import Layout from "src/components/layouts/onboarding";
import css from "./Username.style.css";

import type { ReduxProps } from "./";

class Username extends PureComponent<ReduxProps> {
  render() {
    const {
      submitting,
      asyncValidating,
      messageError,
      loginError,
      valid,
      pristine,
      handleSubmit
    } = this.props;
    return (
      <Layout title="Forgot password?" background={rightBackground}>
        <form id="resetPasswordUser" onSubmit={handleSubmit}>
          <div className={css.fieldContainer}>
            <Field
              id="email"
              name="email"
              label="Email"
              component={TextField}
              type="email"
              fullWidth
            />
          </div>
          <div className={css.helpText}>
            We just need your registered email to send you a four digit code.
          </div>
          <div className={css.error}>{messageError}</div>
          <div className={css.buttonsContainer}>
            <a
              role="button"
              tabIndex="-1"
              className={css.signinButton}
              onClick={() => {
                loginError("");
                this.props.history.push("/signin");
              }}
            >
              Login
            </a>
            <a
              role="button"
              tabIndex="-1"
              className={css.signinButton}
              onClick={() => {
                loginError("");
                this.props.history.push("/reset-password/new-password");
              }}
            >
              I already have a code.
            </a>
          </div>
          <Button
            type="submit"
            disableRipple
            disabled={!valid || pristine || submitting || asyncValidating}
            classes={{
              root: css.nextButton,
              disabled: css.nextButtonDisabled
            }}
          >
            {submitting || asyncValidating ? "Submitting..." : "Reset Password"}
          </Button>
        </form>
      </Layout>
    );
  }
}

export default Username;
