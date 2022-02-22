// @flow
import { connect } from "react-redux";
import { get } from "lodash";
import Toolbar from "./toolbar";
import areAllScenesLocked from "src/redux/selectors/areAllScenesLocked";
import getSelectedScene from "src/redux/selectors/getSelectedScene";
import { collapseScenes } from "src/redux/modules/screenplay";
import {
  selectUnit,
  type Unit,
  type State as UnitState
} from "src/redux/modules/units";
import type { RootReducerState } from "src/redux/modules";
import listUnits from "src/redux/selectors/listUnits";
import type { Cursor, ScreenplayScene } from "src/redux/modules/screenplay";

/**
 * StateProps provide a read-only view of the state.
 */
type StateProps = {|
  +cursor: Cursor,
  +allChangesPublished: boolean,
  +isSpellCheckerActive: boolean,
  +areScenesCollapsed: boolean,
  +selectedScene: ?ScreenplayScene,
  +currentUnitId: $PropertyType<Unit, "id">,
  +unitList: $PropertyType<UnitState, "list">
|};

// TODO: find a better approach to abstract the toolbar differences for sharing
// the component across different layouts
type SharedToolbarProps = {|
  +createNew: () => Promise<any>,
  +createNewAltText: string,
  +publishChanges: () => Promise<any>,
  +search: (query: string, reverse: boolean, focus: boolean) => Promise<any>,
  +clearSearch: () => Promise<any>
|};

type EditorProps = {|
  ...SharedToolbarProps,
  +type: "editor",
  +changeLineClass: string => Promise<any>,
  +toggleBold: () => Promise<any>,
  +toggleItalic: () => Promise<any>,
  +toggleUnderline: () => Promise<any>,
  +toggleSpellChecker: () => Promise<any>,
  +deleteScene: (scene: ScreenplayScene) => Promise<any>,
  +omitScene: (scene: ScreenplayScene) => Promise<any>,
  +lockScenes: () => Promise<any>,
  +printScreenplay: () => Promise<any>,
  +replace: (query: string, replacement: string, all: boolean) => Promise<any>,
  +searchPosition: ?[number, number],
  +undo: Function
|};

type StripboardProps = {|
  ...SharedToolbarProps,
  +type: "stripboard"
|};

type OwnProps = EditorProps | StripboardProps;

const mapStateToProps = (state: RootReducerState): StateProps => ({
  areScenesCollapsed: get(state, "screenplay.areScenesCollapsed", false),
  cursor: get(state, "screenplay.screenplay.cursor", ""),
  allChangesPublished: areAllScenesLocked(state),
  isSpellCheckerActive: get(state, "screenplay.spellchecker.active", false),
  selectedScene: getSelectedScene(state),
  currentUnitId: state.units.currentUnitId,
  unitList: listUnits(state)
});

/**
 * DispatchProps provide ways to mutate the state.
 */
type DispatchProps = {|
  +collapseScenes: typeof collapseScenes,
  +selectUnit: typeof selectUnit
|};

const mapDispatchToProps: DispatchProps = {
  collapseScenes,
  selectUnit
};

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
export type Props = {|
  ...OwnProps,
  ...StateProps,
  ...DispatchProps
|};
