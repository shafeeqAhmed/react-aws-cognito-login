// @flow
import { connect } from "react-redux";
import { flow } from "lodash";
import { withRouter, type ContextRouter } from "react-router";
import {
  uploadSound,
  updateSound,
  deleteSound,
  type Sound
} from "src/redux/modules/sounds";
import { selectActiveTeam, type Team } from "src/redux/modules/teams";
import {
  selectTagSearchResults,
  searchTags,
  createTag,
  addTagToEntity,
  removeTagFromEntity,
  type Search as TagSearch
} from "src/redux/modules/tags";
import { isBrowser } from "config/env";

type StateProps = {|
  +team: ?Team,
  +tagSearch: TagSearch
|};

type OwnProps = {|
  +open: boolean,
  +onClose: Function,
  +sound?: Sound
|};

type DispatchProps = {|
  +uploadSound: Function,
  +updateSound: Function,
  +deleteSound: Function,
  +searchTags: Function,
  +createTag: Function,
  +addTagToEntity: Function,
  +removeTagFromEntity: Function
|};

const mapStateToProps = (state: RootReducerState): StateProps => ({
  team: selectActiveTeam(state),
  tagSearch: selectTagSearchResults(state)
});

const mapDispatchToProps: DispatchProps = {
  uploadSound,
  updateSound,
  deleteSound,
  searchTags,
  createTag,
  addTagToEntity,
  removeTagFromEntity
};

const component = isBrowser()
  ? flow([connect(mapStateToProps, mapDispatchToProps), withRouter])(
      require("./SoundDrawer").default
    )
  : () => null;

export default component;

export type Props = {|
  ...ContextRouter,
  ...StateProps,
  ...DispatchProps,
  ...OwnProps
|};
