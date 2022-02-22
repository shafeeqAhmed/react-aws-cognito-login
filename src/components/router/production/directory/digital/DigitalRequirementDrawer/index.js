// @flow
import { connect } from "react-redux";
import { flow } from "lodash";
import { withRouter, type ContextRouter } from "react-router";
import {
  createElement,
  updateElement,
  deleteElement,
  addItemToElement,
  removeItemFromElement,
  type Element
} from "src/redux/modules/elements";
import {
  searchSounds,
  selectSoundsForElements,
  selectSoundSearchResults,
  type Search as SoundSearch,
  type Sound
} from "src/redux/modules/sounds";
import {
  selectActiveProduction,
  type Production
} from "src/redux/modules/productions";
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
  +production: ?Production,
  +tagSearch: TagSearch,
  +soundSearch: SoundSearch,
  +sounds: Array<Sound>
|};

type OwnProps = {|
  +open: boolean,
  +onClose: Function,
  +element?: Element
|};

type DispatchProps = {|
  +createElement: Function,
  +updateElement: Function,
  +deleteElement: Function,
  +addItemToElement: Function,
  +removeItemFromElement: Function,
  +searchSounds: Function,
  +searchTags: Function,
  +createTag: Function,
  +addTagToEntity: Function,
  +removeTagFromEntity: Function
|};

const mapStateToProps = (
  state: RootReducerState,
  ownProps: OwnProps
): StateProps => ({
  production: selectActiveProduction(state),
  tagSearch: selectTagSearchResults(state),
  soundSearch: selectSoundSearchResults(state),
  sounds: ownProps.element
    ? selectSoundsForElements(state, [ownProps.element])
    : []
});

const mapDispatchToProps: DispatchProps = {
  createElement,
  updateElement,
  deleteElement,
  addItemToElement,
  removeItemFromElement,
  searchSounds,
  searchTags,
  createTag,
  addTagToEntity,
  removeTagFromEntity
};

const component = isBrowser()
  ? flow([connect(mapStateToProps, mapDispatchToProps), withRouter])(
      require("./DigitalRequirementDrawer").default
    )
  : () => null;

export default component;

export type Props = {|
  ...ContextRouter,
  ...StateProps,
  ...DispatchProps,
  ...OwnProps
|};
