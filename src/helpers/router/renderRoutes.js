// @flow
import React from "react";
import { Switch, Route as Branch, Redirect } from "react-router";
import type { Route } from "./route";

export default function renderRoutes(
  routes: ?Array<Route>,
  extraProps?: Object = {},
  switchProps?: Object = {}
) {
  return routes ? (
    <Switch {...switchProps}>
      {routes.map(
        (route, i) =>
          route.redirectTo ? (
            <Redirect
              key={route.key || i}
              from={route.path}
              to={route.redirectTo}
              exact={route.exact}
              strict={route.strict}
              push
            />
          ) : (
            <Branch
              key={route.key || i}
              path={route.path}
              exact={route.exact}
              strict={route.strict}
              render={props => {
                if (!route.component) return null;
                return (
                  <route.component {...props} {...extraProps} route={route} />
                );
              }}
            />
          )
      )}
    </Switch>
  ) : null;
}
