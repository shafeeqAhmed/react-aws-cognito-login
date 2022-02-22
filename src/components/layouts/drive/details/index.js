// @flow
import { connect } from "react-redux";
import { get } from "lodash";
import { withRouter } from "react-router";
import {
  createFolder,
  createScreenplay,
  moveFiles,
  renameFile,
  toggleFavorite,
  deleteFile,
  restoreFile,
  toggleSelected,
  uploadFile,
  copy,
  cut,
  paste,
  duplicateFile,
  getFile,
  listSelectedFiles,
  type File,
  type Clipboard
} from "src/redux/modules/drive";
import {
  fetchPolicies,
  ResourceTypes,
  listSubjectsForResource,
  getOwnerForResource,
  type SubjectsList
} from "src/redux/modules/gatekeeper";
import getCurrentUser from "src/redux/selectors/getCurrentUser";
import type { UserProfile } from "src/redux/modules/users";
import Component from "./details";
import type { RootReducerState } from "src/redux/modules";
import type { Match, Route } from "src/helpers/router/route";

type RouterProps = {
  +route: Route,
  +match: Match<{ productionId: string, folderId: ?string }>,
  +location: Location,
  +history: Object
};

type StateProps = {
  +folder: ?File,
  +selectedFiles: Array<File>,
  +clipboard: Clipboard,
  +currentUser: ?UserProfile,
  +selectedFileSubjects: SubjectsList,
  +selectedFileOwner: ?UserProfile
};

type OwnProps = {};

function mapStateToProps(
  state: RootReducerState,
  props: OwnProps & RouterProps
): StateProps {
  const folderId = get(props, "match.params.folderId", undefined);
  const folder = getFile(state, folderId);
  const selectedFiles = listSelectedFiles(state, folderId);
  const currentUser = getCurrentUser(state);
  const clipboard = state.drive.clipboard;

  const selectedFileSubjects = selectedFiles[0]
    ? listSubjectsForResource(state, {
        type: ResourceTypes.FILE,
        id: selectedFiles[0].id
      })
    : { users: [], tags: [], departments: [] };

  const selectedFileOwner = selectedFiles[0]
    ? getOwnerForResource(state, {
        type: ResourceTypes.FILE,
        id: selectedFiles[0].id
      })
    : null;

  return {
    folder,
    selectedFiles,
    currentUser,
    clipboard,
    selectedFileSubjects,
    selectedFileOwner,
    ...props
  };
}

/**
 * DispatchProps provide ways to mutate the state.
 */
type DispatchProps = {
  +moveFiles: typeof moveFiles,
  +createFolder: typeof createFolder,
  +createScreenplay: typeof createScreenplay,
  +renameFile: typeof renameFile,
  +toggleFavorite: typeof toggleFavorite,
  +deleteFile: typeof deleteFile,
  +restoreFile: typeof restoreFile,
  +toggleSelected: typeof toggleSelected,
  +uploadFile: typeof uploadFile,
  +copy: typeof copy,
  +cut: typeof cut,
  +paste: typeof paste,
  +duplicateFile: typeof duplicateFile,
  +fetchPolicies: typeof fetchPolicies
};

const mapDispatchToProps: DispatchProps = {
  moveFiles,
  createFolder,
  createScreenplay,
  renameFile,
  toggleFavorite,
  deleteFile,
  restoreFile,
  toggleSelected,
  uploadFile,
  copy,
  cut,
  paste,
  duplicateFile,
  fetchPolicies
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Component)
);
export type Props = RouterProps & OwnProps & StateProps & DispatchProps;
