// @flow
import { connect } from "react-redux";
import { flow } from "lodash";
import { withRouter, type ContextRouter } from "react-router";
import {
  fetchTeams,
  selectActiveTeam,
  setActiveTeam,
  type Team
} from "src/redux/modules/teams";
import {
  fetchSounds,
  searchSounds,
  uploadSound,
  selectActiveTeamSounds,
  downloadSounds,
  deleteSound,
  type Sound,
  type Search
} from "src/redux/modules/sounds";
import Component from "./sounds";

type StateProps = {|
  +team: ?Team,
  +sounds: Array<Sound>,
  +search: Search
|};

type OwnProps = {|
  // nothing
|};

type DispatchProps = {|
  +fetchTeams: Function,
  +setActiveTeam: Function,
  +fetchSounds: Function,
  +searchSounds: Function,
  +uploadSound: Function,
  +downloadSounds: Function,
  +deleteSound: Function
|};

const mapStateToProps = (
  state: RootReducerState,
  ownProps: ContextRouter
): StateProps => ({
  team: selectActiveTeam(state),
  sounds: selectActiveTeamSounds(state),
  search: state.sounds.search
});

const mapDispatchToProps: DispatchProps = {
  fetchTeams,
  setActiveTeam,
  fetchSounds,
  searchSounds,
  uploadSound,
  downloadSounds,
  deleteSound
};

export default flow([connect(mapStateToProps, mapDispatchToProps), withRouter])(
  Component
);

export type Props = {|
  ...ContextRouter,
  ...StateProps,
  ...DispatchProps,
  ...OwnProps
|};
