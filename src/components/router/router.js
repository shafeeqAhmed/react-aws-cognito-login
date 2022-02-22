// @flow
import React from "react";
import { isEmpty } from "lodash";
import { Authenticator } from "aws-amplify-react";
import App from "src/components";
import { CognitoStates, CognitoUser } from "src/redux/modules/auth";
import renderRoutes from "src/helpers/router/renderRoutes";
import { toggleWidget } from "src/helpers/widget";
import css from "./router.style.css";
import type { CognitoState } from "src/redux/modules/auth";
import type { ReduxProps } from "./";

const publicRoutes = [
  "/signin",
  "/signup",
  "/set-password",
  "/reset-password/username",
  "/reset-password/new-password"
];

export default class Router extends React.PureComponent<ReduxProps> {
  handleStateChange = (state: CognitoState, data?: CognitoUser) => {
    switch (state) {
      case CognitoStates.signedIn: {
        this.props.login(state, data);
        break;
      }
      case CognitoStates.signIn:
        this.props.logout(state, data);
        this.props.history.push("/signin");
        break;
      default:
        this.props.step(state, data);
    }
  };

  componentWillReceiveProps = (nextProps: ReduxProps) => {
    const { cognitoState, isFetching, productions } = nextProps;
    const prevCognitoState = this.props.cognitoState;
    const prevFetching = this.props.isFetching;

    // User just signed IN
    if (
      prevCognitoState === CognitoStates.signIn &&
      cognitoState === CognitoStates.signedIn &&
      (this.props.history.location.pathname === "/signin" ||
        this.props.history.location.pathname === "/")
    ) {
      toggleWidget(true);
    }

    // User just signed OUT
    if (
      (prevCognitoState === CognitoStates.signIn &&
        cognitoState === CognitoStates.signIn &&
        prevFetching &&
        !isFetching) ||
      (prevCognitoState === CognitoStates.signedIn &&
        cognitoState === CognitoStates.signIn)
    ) {
      toggleWidget(false);

      if (!publicRoutes.includes(nextProps.history.location.pathname)) {
        nextProps.history.push("/signin");
      }
    }

    // If we're on the root path (/) and have just finished fetching
    // productions, redirect to the first production
    if (
      this.props.isFetchingProductions &&
      !nextProps.isFetchingProductions &&
      cognitoState === CognitoStates.signedIn &&
      nextProps.history.location.pathname === "/"
    ) {
      if (!isEmpty(productions)) {
        const pId = productions[0].id;
        nextProps.history.push(`/${pId}/drive`);
      } else {
        nextProps.history.push("/invitations");
      }
    }
  };

  componentDidMount = async () => {
    try {
      await this.props.verifySession();
    } catch (e) {
      // console.error(e);
      this.props.history.push("/signin");
      return;
    }

    this.props.fetchProductions();
  };

  render() {
    const { cognitoState, route } = this.props;

    return (
      <div className={css.container}>
        <Authenticator
          {...this.props}
          hideDefault
          onStateChange={this.handleStateChange}
        >
          {cognitoState === CognitoStates.signedIn ? (
            <App>{renderRoutes(route.routes)}</App>
          ) : (
            renderRoutes(route.routes)
          )}
        </Authenticator>
      </div>
    );
  }
}
