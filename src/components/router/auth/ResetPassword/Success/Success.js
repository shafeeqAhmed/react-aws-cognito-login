// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { Component, Fragment } from "react";
import { CognitoStates } from "src/redux/modules/auth";
import Button from "@material-ui/core/Button";
import Layout from "src/components/layouts/onboarding";
import rightBackground from "static/images/invitationsBackground.png";

import css from "./Success.style.css";

import type { ReduxProps } from "./";

type Props = ReduxProps & {
  history: Object
};

class Success extends Component<Props> {
  render() {
    const { changeCognitoState } = this.props;

    return (
      <Layout title={"Success"} background={rightBackground}>
        <Fragment>
          <div>
            Your password has been reset successfully! You may now login with
            your new password.
          </div>
          <Button
            disableRipple
            classes={{
              root: css.nextButton
            }}
            onClick={() => {
              this.props.history.push("/signin");
              changeCognitoState(CognitoStates.signIn);
            }}
          >
            Login
          </Button>
        </Fragment>
      </Layout>
    );
  }
}

export default Success;
