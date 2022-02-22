// @flow
import { connect } from "react-redux";
import { flow } from "lodash";
import { withRouter, type ContextRouter } from "react-router";
import { selectActiveTeam, type Team } from "src/redux/modules/teams";
import {
  fetchSounds,
  deleteSound,
  downloadSounds,
  getPlayUrl,
  selectActiveTeamSounds,
  type Sound
} from "src/redux/modules/sounds";
import { fetchTags } from "src/redux/modules/tags";
import { isBrowser } from "config/env";

type StateProps = {|
  team: ?Team,
  sounds: Array<Sound>
|};

type OwnProps = {|
  selectedRowIds: Array<string>,
  select: (ids: Array<string>) => void,
  unselect: (ids: Array<string>) => void,
  resetSelection: () => void
|};

type DispatchProps = {|
  +fetchSounds: Function,
  +deleteSound: Function,
  +downloadSounds: Function,
  +getPlayUrl: Function,
  +fetchTags: Function
|};

const mapStateToProps = (
  state: RootReducerState,
  ownProps: ContextRouter
): StateProps => ({
  team: selectActiveTeam(state),
  sounds: selectActiveTeamSounds(state)
});

const mapDispatchToProps: DispatchProps = {
  fetchSounds,
  deleteSound,
  downloadSounds,
  getPlayUrl,
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
  ...StateProps,
  ...DispatchProps,
  ...OwnProps
|};
