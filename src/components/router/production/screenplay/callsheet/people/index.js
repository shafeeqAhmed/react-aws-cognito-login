// @flow
import { connect } from "react-redux";
import Component from "./people";
import { primaryTalent } from "./mock";
import type { RootReducerState } from "src/redux/modules";

type StateProps = {
  +primaryTalent: Array<Object>
};

type OwnProps = {};

const mapStateToProps = (state: RootReducerState): StateProps => ({
  primaryTalent
});

/**
 * DispatchProps provide ways to mutate the state.
 */
type DispatchProps = {};

const mapDispatchToProps: DispatchProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
export type Props = OwnProps & StateProps & DispatchProps;
