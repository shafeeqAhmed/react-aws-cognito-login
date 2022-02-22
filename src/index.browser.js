// @flow
import "babel-polyfill";
import Debug from "debug";
import Amplify from "aws-amplify";
import env from "config/env";
import OfflineRuntime from "offline-plugin/runtime";
import React from "react";
import ReactDOM from "react-dom";
import Rollbar from "rollbar/dist/rollbar.umd.min";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import configureStore from "src/redux/store";
import { loadSuccess } from "src/redux/modules/init";
import rollbarConfig from "config/rollbar";
import vars from "config/variables";
import { setAuthToken } from "src/helpers/auth";
import renderRoutes from "src/helpers/router/renderRoutes";
import routes from "src/routes";

// Material-UI v0.x
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "config/muiTheme";

// Material-UI v1.x and up
import JssProvider from "react-jss/lib/JssProvider";
// eslint-disable-next-line import/no-extraneous-dependencies
import createGenerateClassName from "@material-ui/core/styles/createGenerateClassName";
// eslint-disable-next-line import/no-extraneous-dependencies
import jssPreset from "@material-ui/core/styles/jssPreset";
import { create } from "jss";

if (process.env.NODE_ENV !== "development") {
  window.Rollbar = Rollbar.init(rollbarConfig);
}

const { fobReduxStateVar, jssElementId } = vars;

// AWS Amplify
Amplify.configure({
  identityPoolId: env.AWS_IDENTITY_POOL_ID,
  region: env.AWS_REGION,
  userPoolId: env.AWS_USER_POOL_ID,
  userPoolWebClientId: env.AWS_CLIENT_ID,
  mandatorySignIn: true
});

const log = Debug("my-app:index:browser");
const store = configureStore(window[fobReduxStateVar]);

window.onload = () => {
  store.dispatch(loadSuccess());
  // Can replace with API/store call checks in the future:
  // {
  //   loadedChannels: true,
  //   loadedMessages: true,
  // }

  // Reset this handler when we're done
  window.onload = null;
};

const mountNode = document.getElementById("react-mount");

const generateClassName = createGenerateClassName();
const jss = create({
  ...jssPreset(),
  // We define a custom insertion point that JSS will look for injecting the styles in the DOM.
  insertionPoint: document.getElementById(jssElementId)
});

// TODO: Find a better place to do this
// Update auth token upon every reload so the widget has an updated token
setAuthToken();

ReactDOM.hydrate(
  <Provider store={store}>
    <JssProvider jss={jss} generateClassName={generateClassName}>
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
      </MuiThemeProvider>
    </JssProvider>
  </Provider>,

  mountNode
);

// Progressively apply ServiceWorker updates so browser can simply be refreshed
// to reflect changes with window.location.reload()
// TODO: Fire redux action
OfflineRuntime.install({
  onUpdateReady: () => {
    log("onUpdateReady");
    OfflineRuntime.applyUpdate();
  }
});

// No worky in React 16
// https://reactjs.org/blog/2017/09/26/react-v16.0.html#react-addons
//
// if (process.env.NODE_ENV === 'development') {

//   const Perf = require('react-addons-perf') // eslint-disable-line
//   window.Perf = Perf

// }
