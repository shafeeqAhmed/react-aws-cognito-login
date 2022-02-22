// @flow
import { connect } from "react-redux";
import { ContextRouter, withRouter } from "react-router";
import type { RootReducerState } from "src/redux/modules";
import {
  selectActiveTeamSoundUploads,
  dismissUpload,
  type Sound
} from "src/redux/modules/sounds";
import Component from "./uploader";

type OwnProps = {|
  // nothing
|};

type DispatchProps = {|
  +dismissUpload: typeof dismissUpload
|};

type StateProps = {|
  +sounds: Array<Sound>
|};

const mapStateToProps = (state: RootReducerState): StateProps => ({
  sounds: selectActiveTeamSoundUploads(state)
});

const mapDispatchToProps: DispatchProps = {
  dismissUpload
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Component)
);

export type Props = {|
  ...ContextRouter,
  ...OwnProps,
  ...StateProps,
  ...DispatchProps
|};
