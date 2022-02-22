// @flow
/* eslint import/newline-after-import: 0 */
import { connect } from "react-redux";
import { isBrowser } from "config/env";
import {
  usersUpdated,
  cursorUpdated,
  getCredentials,
  loadEditor,
  lockScenes,
  fetchShootingEvents,
  switchMode,
  selectShootingEvent,
  getSelectedShootingEvent,
  type Screenplay,
  type Mode,
  type ShootingEvent
} from "src/redux/modules/screenplay";
import {
  getCategoriesWithElements,
  type CategoryWithElements,
  fetchCategories
} from "src/redux/modules/categories";
import {
  fetchElements,
  syncAnchorAdded,
  syncAnchorRemoved,
  syncAnchorsRemoved
} from "src/redux/modules/elements";
import { getCurrentUser, type UserProfile } from "src/redux/modules/users";
import type { RootReducerState } from "src/redux/modules";
import type { Match, Route } from "src/helpers/router/route";

type OwnProps = {
  route: Route,
  match: Match<{ productionId: string, screenplayId: string }>
};

/**
 * StateProps provide a read-only view of the state.
 */
type StateProps = {
  +screenplay: ?Screenplay,
  +screenplayMode: ?Mode,
  +shootingEvents: Array<ShootingEvent>,
  +selectedShootingEvent: ?ShootingEvent,
  +currentUser: ?UserProfile,
  +areScenesCollapsed: boolean,
  +categoriesWithElements: Array<CategoryWithElements>
};

function mapStateToProps(state: RootReducerState): StateProps {
  return {
    screenplay: state.screenplay.screenplay,
    screenplayMode: state.screenplay.mode,
    shootingEvents: state.screenplay.shootingEvents,
    selectedShootingEvent: getSelectedShootingEvent(state),
    currentUser: getCurrentUser(state),
    areScenesCollapsed: state.screenplay.areScenesCollapsed,
    categoriesWithElements: getCategoriesWithElements(state)
  };
}

/**
 * DispatchProps provide ways to mutate the state.
 */
type DispatchProps = {
  +usersUpdated: Function,
  +cursorUpdated: Function,
  +getCredentials: Function,
  +loadEditor: Function,
  +lockScenes: Function,
  +fetchShootingEvents: Function,
  +selectShootingEvent: Function,
  +switchMode: Function,
  +fetchCategories: Function,
  +fetchElements: Function,
  +syncAnchorAdded: Function,
  +syncAnchorRemoved: Function,
  +syncAnchorsRemoved: Function
};

const mapDispatchToProps: DispatchProps = {
  usersUpdated,
  cursorUpdated,
  getCredentials,
  loadEditor,
  lockScenes,
  fetchShootingEvents,
  selectShootingEvent,
  switchMode,
  fetchCategories,
  fetchElements,
  syncAnchorAdded,
  syncAnchorRemoved,
  syncAnchorsRemoved
};

// Server-side rendering does not work with codemirror
// So we are only requiring the actual component in the browser
const breakdown = isBrowser()
  ? // $FlowExpectedError
    connect(mapStateToProps, mapDispatchToProps)(require("./breakdown").default)
  : null;
export default breakdown;
export type ReduxProps = OwnProps & StateProps & DispatchProps;
