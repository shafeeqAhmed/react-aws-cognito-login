// @flow
import { connect } from "react-redux";
import Component from "./right-sidebar";

import { people, contacts } from "./mock";

/**
 * RouterProps are injected by react router.
 */
type OwnProps = {};

/**
 * StateProps provide a read-only view of the state.
 */
type StateProps = {
  +people: Array<Object>,
  +contacts: Array<Object>
};

const mapStateToProps = (state: RootReducerState): StateProps => ({
  people,
  contacts
});

/**
 * DispatchProps provide ways to mutate the state.
 */
type DispatchProps = {};

const mapDispatchToProps: DispatchProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
export type ReduxProps = OwnProps & StateProps & DispatchProps;
