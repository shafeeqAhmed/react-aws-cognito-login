// @flow
import { connect } from "react-redux";
import { get } from "lodash";
import { withRouter } from "react-router";
import {
  fetchFolderContent,
  fetchRecent,
  fetchDeleted,
  fetchFavorites,
  fetchFilePath,
  Sections
} from "src/redux/modules/drive";
import {
  listDeletedFiles,
  listFavoriteFiles,
  listFolderContent,
  listRecentFiles,
  getFile
} from "src/redux/modules/drive/selectors";
import Component from "./folder";
import type { RootReducerState } from "src/redux/modules";
import type { Match, Route } from "src/helpers/router/route";
import type { File } from "src/redux/modules/drive";

type RouterProps = {
  +route: Route,
  +match: Match<{ productionId: string, folderId: ?string }>,
  +location: Location
};

type StateProps = {
  +folder: ?File,
  +files: Array<File>
};

type OwnProps = {};

function mapStateToProps(
  state: RootReducerState,
  props: OwnProps & RouterProps
): StateProps {
  let files: Array<File>;
  const folderId = get(props, "match.params.folderId", "");
  const folder = getFile(state, folderId);

  switch (folderId) {
    case Sections.RECENT:
      files = listRecentFiles(state);
      break;
    case Sections.FAVORITES:
      files = listFavoriteFiles(state);
      break;
    case Sections.TRASH:
      files = listDeletedFiles(state);
      break;
    default:
      files = listFolderContent(state, folderId);
      break;
  }

  return {
    files,
    folder,
    ...props
  };
}

/**
 * DispatchProps provide ways to mutate the state.
 */
type DispatchProps = {
  +fetchFolderContent: Function,
  +fetchRecent: Function,
  +fetchDeleted: Function,
  +fetchFavorites: Function,
  +fetchFilePath: Function
};

const mapDispatchToProps: DispatchProps = {
  fetchFolderContent,
  fetchRecent,
  fetchDeleted,
  fetchFavorites,
  fetchFilePath
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Component)
);
export type Props = RouterProps & OwnProps & StateProps & DispatchProps;
