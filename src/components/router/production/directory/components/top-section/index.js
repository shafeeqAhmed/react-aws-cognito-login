// @flow
import { connect } from "react-redux";
import Component from "./top-section";
import type { RootReducerState } from "src/redux/modules";

type StateProps = {};

type OwnProps = {
  +sectionName: string
};

function mapStateToProps(state: RootReducerState, props: OwnProps): StateProps {
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
export type Props = OwnProps & StateProps & DispatchProps;
