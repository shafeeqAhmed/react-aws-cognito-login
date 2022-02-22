// @flow
import { connect } from "react-redux";
import Component from "./requirements";
import { requirements, bulletins } from "./mock";
import type { RootReducerState } from "src/redux/modules";
import type { RouterHistory } from "react-router";
import type { Match, Route } from "src/helpers/router/route";

type RouterProps = {
  route: Route,
  match: Match<{ productionId: string, folderId: ?string }>,
  +location: Location,
  +history: RouterHistory
};

type StateProps = {
  +requirements: Array<Object>,
  +bulletins: Array<Object>
};

type OwnProps = {};

function mapStateToProps(
  state: RootReducerState,
  props: OwnProps & RouterProps
): StateProps {
  return {
    requirements,
    bulletins,
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
