// @flow
import type { Match, Route } from "src/helpers/router/route";
import NewTeam from "./newTeam";

type RouterProps = {
  +route: Route,
  +match: Match<{ productionId: string }>,
  +location: Location
};

export default NewTeam;
export type ReduxProps = RouterProps;
