// @flow
import { withRouter } from "react-router";
import Component from "./navigator";
import type { Match } from "src/helpers/router/route";

type RouterProps = {
  match: Match<{ productionId: string, folderId: ?string }>,
  location: Location,
  history: Object
};

export default withRouter(Component);
export type Props = RouterProps;
