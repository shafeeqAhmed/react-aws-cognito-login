// @flow
import { connect } from "react-redux";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { get, isEqual } from "lodash";
import { withRouter } from "react-router";
import Component from "./table";
import {
  getLastSelectedFile,
  listSelectedFiles
} from "src/redux/modules/drive/selectors";
import {
  deleteFile,
  duplicateFile,
  toggleSelected,
  toggleFavorite,
  uploadFile,
  downloadFile,
  openFile,
  getDownloadUrl
} from "src/redux/modules/drive";
import type { RootReducerState } from "src/redux/modules";
import type { Match, Route } from "src/helpers/router/route";
import type { File } from "src/redux/modules/drive";
import getCurrentUser from "src/redux/selectors/getCurrentUser";
import type { UserProfile } from "src/redux/modules/users";

type RouterProps = {
  +route: Route,
  +match: Match<{ productionId: string, folderId: ?string }>,
  +history: Object,
  +location: Location
};

type StateProps = {
  +selectedFiles: Array<File>,
  +lastSelectedFile: ?File,
  +allFilesAreSelected: boolean,
  +currentUser: ?UserProfile
};

type OwnProps = {
  files: Array<File>
};

function mapStateToProps(
  state: RootReducerState,
  props: OwnProps & RouterProps
): StateProps {
  const folderId = get(props, "match.params.folderId", undefined);
  const selectedFiles = listSelectedFiles(state, folderId);
  const lastSelectedFile = getLastSelectedFile(state);
  const currentUser = getCurrentUser(state);

  return {
    selectedFiles,
    lastSelectedFile,
    allFilesAreSelected: isEqual(
      selectedFiles.map(f => f.id).sort(),
      props.files.map(f => f.id).sort()
    ),
    currentUser,
    ...props
  };
}

/**
 * DispatchProps provide ways to mutate the state.
 */
type DispatchProps = {
  +deleteFile: typeof deleteFile,
  +duplicateFile: typeof duplicateFile,
  +toggleSelected: typeof toggleSelected,
  +toggleFavorite: typeof toggleFavorite,
  +uploadFile: typeof uploadFile,
  +downloadFile: typeof downloadFile,
  +openFile: typeof openFile,
  +getDownloadUrl: typeof getDownloadUrl
};

const mapDispatchToProps: DispatchProps = {
  deleteFile,
  duplicateFile,
  toggleSelected,
  toggleFavorite,
  uploadFile,
  downloadFile,
  openFile,
  getDownloadUrl
};

export default withRouter(
  DragDropContext(HTML5Backend)(
    connect(mapStateToProps, mapDispatchToProps)(Component)
  )
);
export type Props = RouterProps & OwnProps & StateProps & DispatchProps;
