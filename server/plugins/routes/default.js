// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React from "react";
import { renderToString } from "react-dom/server";
import Helmet from "react-helmet";
import { Provider } from "react-redux";
import { StaticRouter } from "react-router";
import { SheetsRegistry } from "react-jss/lib/jss";
import JssProvider from "react-jss/lib/JssProvider";
import createGenerateClassName from "@material-ui/core/styles/createGenerateClassName";
import { getAssets, getCss } from "server/utils";
import configureStore from "src/redux/store";
import { initialState as authInitialState } from "src/redux/modules/auth";
import env from "config/env";

import renderRoutes from "src/helpers/router/renderRoutes";
import routes from "src/routes";

// Material-UI
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "config/muiTheme";

export default {
  name: "defaultReactRoute",
  version: "1.0.0",
  register: (server: Object) => {
    server.route({
      method: "GET",
      path: "/{param*}",
      handler: async (request: Object, h: Function) => {
        if (module.hot) {
          module.hot.accept(
            [
              "src/routes",
              "src/redux/store",
              "src/redux/modules/auth",
              "config/env",
              "config/variables",
              "server/utils"
            ],
            () => {}
          );
        }

        // Inject server request info
        const _request = { userAgent: request.headers["user-agent"] };

        // material-ui v0.x
        const muiTheme = getMuiTheme(_request.userAgent);

        // @material-ui/core (v3.x)
        const sheetsRegistry = new SheetsRegistry();
        const generateClassName = createGenerateClassName();

        // TODO: get aws amplify to work in SSR

        // const cookie = request.state[vars.appAuthCookieKey];
        // const token = cookie ? Base64.decode(cookie) : "";

        // Pass initial state to store along with server ENV vars
        const store = configureStore({
          auth: {
            ...authInitialState
          },
          env,
          request: _request
        });

        // DISPATCH ASYNC SERVER-SIDE CALLS HERE
        // SEO, meta tags, etc
        // example: await store.dispatch(getTodos());

        // If you're getting meta tags info, be sure to set using react-helmet
        // inside the respective component. (Don't mess with it here)

        // Let react-router match the raw URL to generate the
        // RouterContext here on the server
        const context = {};

        // Get rendered router context
        const children = renderToString(
          <Provider store={store}>
            <JssProvider
              registry={sheetsRegistry}
              generateClassName={generateClassName}
            >
              <MuiThemeProvider muiTheme={muiTheme}>
                <StaticRouter location={request.url.href} context={context}>
                  {renderRoutes(routes)}
                </StaticRouter>
              </MuiThemeProvider>
            </JssProvider>
          </Provider>
        );

        // Redirects that can return early
        //
        // Only redirect, no code
        if (context.url && !context.code) {
          return h
            .response()
            .redirect(context.url)
            .temporary();
        } else if (context.url && context.code) {
          // Both redirect and code! ZOMG!
          return h
            .response()
            .redirect(context.url)
            .code(context.code);
        }

        // Get resulting store state
        const preloadedState = store.getState();

        // Get resulting head info
        const head = Helmet.rewind();

        // @material-ui/core v1.x and up
        const muiCss = sheetsRegistry.toString();

        const htmlProps = {
          assets: getAssets(),
          children,
          muiCss,
          css: getCss(),
          head,
          preloadedState
        };

        // Render the layout with props
        const response = h.view("Html", htmlProps);

        // If code but no redirect (e.g. 4xx page, 5xx page...)
        if (!context.url && context.code) return response.code(context.code);

        return response;
      }
    });
  }
};
