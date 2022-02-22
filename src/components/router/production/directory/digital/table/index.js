// @flow
import { connect } from "react-redux";
import { flow, get } from "lodash";
import { type RootReducerState } from "src/redux/modules";
import { withRouter, ContextRouter } from "react-router";
import {
  fetchElements,
  deleteElement,
  searchElements,
  type Search
} from "src/redux/modules/elements";
import { selectElements } from "src/redux/modules/elements/selectors";
import { fetchTags } from "src/redux/modules/tags";
import {
  fetchSounds,
  type Sound,
  selectSoundsForElements
} from "src/redux/modules/sounds";
import type { Category } from "src/redux/modules/categories";
import {
  type Production,
  getCurrentProduction as selectActiveProduction
} from "src/redux/modules/productions";
import { isBrowser } from "config/env";

type OwnProps = {|
  +category: Category
|};

type StateProps = {|
  +production: ?Production,
  +search: Search,
  +elements: Array<Element>,
  +sounds: Array<Sound>
|};

const mapStateToProps = (
  state: RootReducerState,
  ownProps: OwnProps
): StateProps => {
  const elements = selectElements(state, get(ownProps, "category.id", ""));
  const sounds = selectSoundsForElements(state, elements);

  return {
    production: selectActiveProduction(state),
    search: state.elements.search,
    elements,
    sounds
  };
};

type DispatchProps = {|
  +fetchElements: Function,
  +deleteElement: Function,
  +searchElements: Function,
  +fetchSounds: Function,
  +fetchTags: Function
|};

const mapDispatchToProps: DispatchProps = {
  fetchElements,
  deleteElement,
  searchElements,
  fetchSounds,
  fetchTags
};

const component = isBrowser()
  ? flow([connect(mapStateToProps, mapDispatchToProps), withRouter])(
      require("./table").default
    )
  : () => null;

export default component;

export type Props = {|
  ...ContextRouter,
  ...OwnProps,
  ...StateProps,
  ...DispatchProps
|};
