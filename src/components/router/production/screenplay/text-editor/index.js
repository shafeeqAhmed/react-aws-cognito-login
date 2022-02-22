// @flow
/* eslint import/newline-after-import: 0 */
import { connect } from "react-redux";
import { isBrowser } from "config/env";
import {
  scenesUpdated,
  usersUpdated,
  cursorUpdated,
  getCredentials,
  loadEditor,
  selectScene,
  lockScenes,
  toggleSpellChecker,
  addToDictionary,
  removeFromDictionary
} from "src/redux/modules/screenplay";
import type { RootReducerState } from "src/redux/modules";
import type {
  Screenplay,
  ScreenplayScene,
  Spellchecker,
  Mode
} from "src/redux/modules/screenplay";
import type { UserProfile } from "src/redux/modules/users";
import getSelectedScene from "src/redux/selectors/getSelectedScene";
import getCurrentUser from "src/redux/selectors/getCurrentUser";
import type { Comment } from "src/redux/modules/comments";
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
  +selectedScene: ?ScreenplayScene,
  +currentUser: ?UserProfile,
  +spellchecker: Spellchecker,
  +comments: Array<Comment>,
  +isAddingNewComment: boolean
};

const mapStateToProps = (state: RootReducerState): StateProps => ({
  screenplay: state.screenplay.screenplay,
  screenplayMode: state.screenplay.mode,
  selectedScene: getSelectedScene(state),
  currentUser: getCurrentUser(state),
  spellchecker: state.screenplay.spellchecker,
  comments: state.comments.items,
  isAddingNewComment: state.comments.isAddingNewComment
});

/**
 * DispatchProps provide ways to mutate the state.
 */
type DispatchProps = {
  +getCredentials: Function,
  +scenesUpdated: Function,
  +usersUpdated: Function,
  +cursorUpdated: Function,
  +loadEditor: Function,
  +selectScene: Function,
  +lockScenes: Function,
  +toggleSpellChecker: Function,
  +addToDictionary: Function,
  +removeFromDictionary: Function
};

const mapDispatchToProps: DispatchProps = {
  getCredentials,
  scenesUpdated,
  usersUpdated,
  cursorUpdated,
  loadEditor,
  selectScene,
  lockScenes,
  toggleSpellChecker,
  addToDictionary,
  removeFromDictionary
};

const editor = isBrowser()
  ? // $FlowExpectedError
    connect(mapStateToProps, mapDispatchToProps)(require("./editor").default)
  : null;
export default editor;
export type ReduxProps = OwnProps & StateProps & DispatchProps;
