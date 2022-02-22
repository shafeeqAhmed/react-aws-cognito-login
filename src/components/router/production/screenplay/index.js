// @flow
import { connect } from "react-redux";
import { getMetadata, getCredentials } from "src/redux/modules/screenplay";
import getCurrentProduction from "src/redux/selectors/getCurrentProduction";
import type { RootReducerState } from "src/redux/modules";
import type { Production } from "src/redux/modules/productions";
import type { State as ScreenplayState } from "src/redux/modules/screenplay";
import { fetchUnits } from "src/redux/modules/units";
import type { Match, Route } from "src/helpers/router/route";
import ScreenplayComponent from "./screenplay";

/**
 * RouterProps are injected by react router.
 */
type OwnProps = {
  route: Route,
  match: Match<{ productionId: string, screenplayId: string }>
};

/**
 * StateProps provide a read-only view of the state.
 */
type StateProps = {
  +production: ?Production,
  +screenplay: ScreenplayState
};

const mapStateToProps = (state: RootReducerState): StateProps => ({
  production: getCurrentProduction(state),
  screenplay: state.screenplay
});

/**
 * DispatchProps provide ways to mutate the state.
 */
type DispatchProps = {
  +getMetadata: Function,
  +getCredentials: Function,
  fetchUnits: typeof fetchUnits
};

const mapDispatchToProps: DispatchProps = {
  getMetadata,
  getCredentials,
  fetchUnits
};

export default connect(mapStateToProps, mapDispatchToProps)(
  ScreenplayComponent
);
export type ReduxProps = OwnProps & StateProps & DispatchProps;
