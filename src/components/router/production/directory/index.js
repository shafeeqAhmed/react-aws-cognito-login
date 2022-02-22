// @flow
import { connect } from "react-redux";
import Component from "./directory";
import { fetchCategories } from "src/redux/modules/categories";
import type { RootReducerState } from "src/redux/modules";
import type { RouterHistory } from "react-router";
import type { Match, Route } from "src/helpers/router/route";

type RouterProps = {
  route: Route,
  match: Match<{ productionId: string, folderId: ?string }>,
  +location: Location,
  +history: RouterHistory
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

type DispatchProps = {
  +fetchCategories: Function
};

const mapDispatchToProps: DispatchProps = {
  fetchCategories
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
export type Props = RouterProps & OwnProps & StateProps & DispatchProps;
