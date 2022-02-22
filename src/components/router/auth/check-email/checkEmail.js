// @flow
import React, { PureComponent } from "react";
import Layout from "src/components/layouts/onboarding";
import rightBackground from "static/images/signupBackground.png";
import type { ReduxProps } from "./";
import css from "./checkEmail.style.css";

class CheckEmail extends PureComponent<ReduxProps> {
  render() {
    const { email } = this.props;
    return (
      <Layout title={"Please Check Your Email"} background={rightBackground}>
        <div className={css.content}>
          <div className={css.text}>
            We’ve sent an email to <span>{email}</span>
            {"\n"}
            with instructions for setting up your password
          </div>
          <div className={css.continueText}>To continue, open the email.</div>
          <div className={css.closeText}>You can close this window</div>
        </div>
      </Layout>
    );
  }
}

export default CheckEmail;
