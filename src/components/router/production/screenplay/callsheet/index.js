// @flow
import Component from "./callsheet";
import type { RouterHistory } from "react-router";
import type { Route } from "src/helpers/router/route";

type RouterProps = {
  route: Route,
  +location: Location,
  +history: RouterHistory
};

export default Component;
export type Props = RouterProps;
