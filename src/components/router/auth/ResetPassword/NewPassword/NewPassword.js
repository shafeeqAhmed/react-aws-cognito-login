// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from "react";
import { Field } from "redux-form";
import TextField from "src/components/shared/TextField";
import rightBackground from "static/images/invitationsBackground.png";
import Layout from "src/components/layouts/onboarding";
import Button from "@material-ui/core/Button";
import { CognitoStates } from "src/redux/modules/auth";
import css from "./NewPassword.style.css";
import type { ReduxProps } from "./";

class NewPassword extends PureComponent<ReduxProps> {
  componentDidMount = () =>
    // TODO: implement autofocus upon mount for all other forms
    this.emailField.current &&
    this.emailField.current
      .getRenderedComponent()
      .getInputNode()
      .focus();

  emailField = React.createRef();

  render() {
    const {
      handleSubmit,
      submitting,
      asyncValidating,
      messageError,
      changeCognitoState,
      loginError,
      valid,
      pristine
    } = this.props;

    return (
      <Layout title="Reset your password" background={rightBackground}>
        <form id="newPasswordForm" onSubmit={handleSubmit}>
          <div className={css.fieldContainer}>
            <div className={css.field}>
              <Field
                withRef
                ref={this.emailField}
                id="email"
                name="email"
                label="Email Address"
                component={TextField}
                style={css.field}
                type="email"
                fullWidth
              />
            </div>
            <div className={css.field}>
              <Field
                id="code"
                name="code"
                label="Code"
                component={TextField}
                style={css.field}
                type="text"
                fullWidth
              />
            </div>
            <div className={css.field}>
              <Field
                id="password1"
                name="password1"
                label="Enter new password"
                component={TextField}
                style={css.field}
                type="password"
                fullWidth
              />
            </div>
            <div className={css.field}>
              <Field
                id="password2"
                name="password2"
                label="Re-enter new password"
                component={TextField}
                style={css.field}
                type="password"
                fullWidth
              />
            </div>
          </div>
          <div className={css.error}>{messageError}</div>
          <a
            role="button"
            tabIndex="-1"
            className={css.signinButton}
            onClick={() => {
              this.props.history.push("/signin");
              changeCognitoState(CognitoStates.signIn);
              loginError("");
            }}
          >
            Login
          </a>
          <Button
            type="submit"
            disableRipple
            disabled={!valid || pristine || submitting || asyncValidating}
            classes={{
              root: css.nextButton,
              disabled: css.nextButtonDisabled
            }}
          >
            {submitting || asyncValidating ? "Submitting..." : "New password"}
          </Button>
        </form>
      </Layout>
    );
  }
}

export default NewPassword;
