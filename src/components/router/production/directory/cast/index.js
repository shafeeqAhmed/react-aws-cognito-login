// @flow
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Component from "./cast";
import type { RootReducerState } from "src/redux/modules";
import type { Match, Route } from "src/helpers/router/route";

type RouterProps = {
  +route: Route,
  +match: Match<{ productionId: string, folderId: ?string }>,
  +location: Location
};

type StateProps = {};

type OwnProps = {};

function mapStateToProps(
  state: RootReducerState,
  props: OwnProps & RouterProps
): StateProps {
  return {};
}

/**
 * DispatchProps provide ways to mutate the state.
 */
type DispatchProps = {};

const mapDispatchToProps: DispatchProps = {};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Component)
);
export type Props = RouterProps & OwnProps & StateProps & DispatchProps;
