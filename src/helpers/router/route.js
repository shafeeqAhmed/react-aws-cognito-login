// @flow
import { type Node } from "react";

export type Route = {
  path?: string,
  component?: Node,
  exact?: boolean,
  strict?: boolean,
  key?: string,
  redirectTo?: string,
  routes?: Array<Route>
};

export type Match<T> = {
  path: string,
  url: string,
  isExact: boolean,
  isStrict: boolean,
  params: T
};
