// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { Component } from "react";
import { Field } from "redux-form";
import TextField from "src/components/shared/TextField";
import ButtonBase from "@material-ui/core/ButtonBase";
import Button from "@material-ui/core/Button";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Layout from "src/components/layouts/onboarding";
import rightBackground from "static/images/setPasswordBackground.png";
import css from "./setUpPassword.style.css";
import qs from "qs";
import { Auth } from "aws-amplify";
import type { ReduxProps } from "./";

type State = {
  showPassword: boolean,
  showConfirmPassword: boolean
};

export default class SetUpPassword extends Component<ReduxProps, State> {
  state = {
    showPassword: false,
    showConfirmPassword: false
  };

  componentDidMount = async () => {
    const { history, showError, temporaryUser } = this.props;
    const { username, password } = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true
    });

    if (!temporaryUser && username && password) {
      try {
        await Auth.signOut();
        console.log("signIn", username, password);
        const user = await Auth.signIn(username, password);
        console.log("after signIn", user);
        if (user && user.challengeName === "NEW_PASSWORD_REQUIRED") {
          console.log("set temporary user");
          this.props.setTemporaryUser(user);
        }
      } catch (e) {
        console.log("signIn error", e);
        showError(e.message);
        history.replace("/signin");
      }
    }
  };

  handlePasswordVisibility = (field: string) => {
    this.setState({
      [field]: !this.state[field]
    });
  };

  render() {
    const { showPassword, showConfirmPassword } = this.state;
    const {
      valid,
      pristine,
      handleSubmit,
      messageError,
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
      height: 80,
      paddingBottom: 30,
      fontSize: 20
    };

    const errorStyle = {
      right: 0,
      bottom: 27,
      fontSize: 16
    };

    return (
      <Layout title="Set Password" background={rightBackground}>
        <form id="setUpPasswordForm" onSubmit={handleSubmit}>
          <div className={css.fieldContainer}>
            <div className={css.field}>
              <Field
                id="password"
                name="password"
                label="Password"
                component={TextField}
                type={showPassword ? "text" : "password"}
                fullWidth
                errorStyle={errorStyle}
                labelStyle={labelStyle}
                style={inputStyle}
              />
              <ButtonBase
                tabIndex="-1"
                disableRipple
                onClick={() => this.handlePasswordVisibility("showPassword")}
              >
                {showPassword ? (
                  <VisibilityOff
                    classes={{
                      root: css.fieldIcon
                    }}
                  />
                ) : (
                  <Visibility
                    classes={{
                      root: css.fieldIcon
                    }}
                  />
                )}
              </ButtonBase>
            </div>
            <div className={css.field}>
              <Field
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm password"
                component={TextField}
                type={showConfirmPassword ? "text" : "password"}
                fullWidth
                errorStyle={errorStyle}
                labelStyle={labelStyle}
                style={inputStyle}
              />
              <ButtonBase
                tabIndex="-1"
                disableRipple
                onClick={() =>
                  this.handlePasswordVisibility("showConfirmPassword")
                }
              >
                {showConfirmPassword ? (
                  <VisibilityOff
                    classes={{
                      root: css.fieldIcon
                    }}
                  />
                ) : (
                  <Visibility
                    classes={{
                      root: css.fieldIcon
                    }}
                  />
                )}
              </ButtonBase>
            </div>
          </div>
          <div className={css.helpText} />
          <div className={css.messageError}>{messageError || null}</div>
          <Button
            type="submit"
            disableRipple
            disabled={!valid || pristine || submitting || asyncValidating}
            classes={{
              root: css.nextButton,
              disabled: css.nextButtonDisabled
            }}
          >
            {submitting || asyncValidating ? "Submitting..." : "Next"}
          </Button>
        </form>
      </Layout>
    );
  }
}
