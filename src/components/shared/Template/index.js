// @flow
// import { connect } from "react-redux";
// import { type RootReducerState } from "src/redux/modules";
import Template from "./Template";

/**
 * OwnProps are injected by react router or other providers.
 */
type OwnProps = {|
  // ...ContextRouter
|};

/**
 * StateProps provide a read-only view of the redux state.
 */
type StateProps = {||};

// const mapStateToProps = (state: RootReducerState): StateProps => ({});

/**
 * DispatchProps inject actions to mutate the redux state.
 */
type DispatchProps = {||};

// const mapDispatchToProps = (dispatch: GlobalDispatch<*>): DispatchProps => ({});

// export default connect(
//   mapStateToProps,
//   // mapDispatchToProps
// )(Template);
export default Template;
export type Props = {|
  ...OwnProps,
  ...StateProps,
  ...DispatchProps
|};
