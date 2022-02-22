// @flow
import React, { Component } from "react";
import Helmet from "react-helmet";
import { Field } from "redux-form";
import { CognitoStates } from "src/redux/modules/auth";
import TextField from "src/components/shared/TextField";
import imgLogo from "static/images/logo_lg_procliq.png";
import imgLogoRocksauce from "static/images/logo_lg_rocksauce.png";
import css from "./SignIn.style.css";
import { type Props } from "./";

class SignIn extends Component<Props> {
  render() {
    const {
      loginError,
      messageError,
      changeCognitoState,
      handleSubmit,
      submitting,
      asyncValidating,
      history
    } = this.props;

    return (
      <div className={css.login}>
        <Helmet title="Sign In" />
        <div className={css.loginForm}>
          <div className={css.logo}>
            <img src={imgLogo} alt="ProCliq" />
          </div>
          <form
            id="signInForm"
            className={css.fieldContainer}
            onSubmit={handleSubmit}
          >
            <Field
              id="username"
              name="username"
              label="Email Address"
              component={TextField}
              className={css.field}
              type="email"
              fullWidth
              maxLength="128"
              autoComplete="email"
              floatingLabelFixed
              // input={{
              //   autoComplete: "email",
              //   floatingLabelFixed: true
              // }}
            />
            <Field
              id="password"
              name="password"
              label="Password"
              component={TextField}
              className={css.field}
              type="password"
              fullWidth
              maxLength="128"
              autoComplete="current-password"
              floatingLabelFixed
              // input={{
              //   autoComplete: "current-password",
              //   floatingLabelFixed: true
              // }}
            />
            <div
              tabIndex="-1"
              role="button"
              className={css.forgotPassword}
              onClick={() => {
                history.push("/reset-password/username");
                loginError("");
                changeCognitoState(CognitoStates.forgotPassword);
              }}
            >
              Forgot Password?
            </div>
            <div className={css.error}>{messageError}</div>
            <button
              type="submit"
              className={css.submit}
              disabled={submitting || asyncValidating}
            >
              {submitting || asyncValidating ? "Submitting..." : "Sign In"}
            </button>
            <div className={css.logoRocksauce}>
              <a
                href="https://www.rocksaucestudios.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={imgLogoRocksauce} alt="Rocksauce Studios" />
              </a>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default SignIn;
