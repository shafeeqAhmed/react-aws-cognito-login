// @flow
import { connect } from "react-redux";
import { withRouter, type ContextRouter } from "react-router";
import { get } from "lodash";
import Component from "./search";
import { listSearchedFiles } from "src/redux/modules/drive/selectors";
import { clearSearch, search } from "src/redux/modules/drive";
import { getCurrentProduction } from "src/redux/modules/productions/selectors";
import type { RootReducerState } from "src/redux/modules";
import type { File } from "src/redux/modules/drive";
import type { Production } from "src/redux/modules/productions";

type OwnProps = {
  ...ContextRouter
};

type StateProps = {
  +production: ?Production,
  +suggestions: Array<File>,
  +query: string
};

const mapStateToProps = (state: RootReducerState): StateProps => ({
  production: getCurrentProduction(state),
  suggestions: listSearchedFiles(state),
  query: get(state, "search.query", "")
});

/**
 * DispatchProps provide ways to mutate the state.
 */
type DispatchProps = {
  +clearSearch: typeof clearSearch,
  +search: typeof search
};

const mapDispatchToProps: DispatchProps = {
  clearSearch,
  search
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Component)
);
export type Props = OwnProps & StateProps & DispatchProps;
