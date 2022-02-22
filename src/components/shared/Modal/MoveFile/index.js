// @flow
import { connect } from "react-redux";
import Component from "./moveFile";
import { get } from "lodash";
import {
  listSelectedFiles,
  listFolders
} from "src/redux/modules/drive/selectors";
import {
  fetchFolderContent,
  moveFiles,
  selectProductionToMove
} from "src/redux/modules/drive";
import getCurrentProduction from "src/redux/selectors/getCurrentProduction";
import type { FolderTree } from "src/redux/modules/drive/selectors/listFolders";
import type { File } from "src/redux/modules/drive";
import type { Production } from "src/redux/modules/productions";

type RouterProps = {};

type StateProps = {
  +selectedFiles: Array<File>,
  +folders: FolderTree,
  +isFirstLevelFetched: boolean,
  +productionId: number,
  +fetchedFolders: Array<string>,
  +production: ?Production,
  +productions: ?Array<Production>,
  +productionToMove: ?number
};

type OwnProps = {
  onClose: Function,
  file?: File,
  files?: Array<File>
};

const mapStateToProps = (
  state: RootReducerState,
  props: OwnProps & RouterProps
): StateProps => {
  const folderId = get(props, "match.params.folderId", undefined);
  const selectedFiles = props.file
    ? [props.file]
    : props.files || listSelectedFiles(state, folderId);
  const foldersList = listFolders(state);

  return {
    folders: foldersList,
    isFirstLevelFetched: state.drive.moveToDialog.isFirstLevelFetched,
    selectedFiles,
    fetchedFolders: state.drive.moveToDialog.fetchedFolders,
    productionId: state.productions.activeProductionID,
    production: getCurrentProduction(state),
    productions: state.productions.productions,
    productionToMove: state.drive.moveToDialog.productionToMove
  };
};

/**
 * DispatchProps provide ways to mutate the state.
 */
type DispatchProps = {
  fetchFolderContent: Function,
  moveFiles: Function,
  selectProductionToMove: Function
};

const mapDispatchToProps: DispatchProps = {
  fetchFolderContent,
  moveFiles,
  selectProductionToMove
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);

export type Props = RouterProps & OwnProps & StateProps & DispatchProps;
