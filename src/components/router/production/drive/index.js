// @flow
import { connect } from "react-redux";
import Component from "./drive";
import type { RootReducerState } from "src/redux/modules";
import type { Match, Route } from "src/helpers/router/route";

type RouterProps = {
  route: Route,
  match: Match<{ productionId: string, folderId: ?string }>
};

type StateProps = {};

type OwnProps = {};

function mapStateToProps(
  state: RootReducerState,
  props: OwnProps & RouterProps
): StateProps {
  return {
    ...props
  };
}

/**
 * DispatchProps provide ways to mutate the state.
 */
type DispatchProps = {};

const mapDispatchToProps: DispatchProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
export type Props = RouterProps & OwnProps & StateProps & DispatchProps;
