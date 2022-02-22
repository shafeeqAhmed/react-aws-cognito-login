// @flow
import * as reducers from "./reducers";
import * as actions from "./actions";

export * from "./actions";
export * from "./selectors";
export * from "./helpers";

/**
 * State
 */
export const FileTypes = {
  FOLDER: ("folder": "folder"),
  UPLOAD: ("upload": "upload"),
  SCREENPLAY: ("screenplay": "screenplay")
};

export type FileType = $Values<typeof FileTypes>;

export const Sections = {
  FILES: ("files": "files"),
  RECENT: ("recent": "recent"),
  FAVORITES: ("favorites": "favorites"),
  TRASH: ("trash": "trash")
};

export type Section = $Values<typeof Sections>;

export type Download = {
  processId?: number,
  url?: string
};

export type File = {
  +id: string,
  +version: number,
  +productionId: number,
  +name: string,
  +folderId: ?string,
  +filePath: string,
  +fileSize: number,
  +fileType: FileType,
  +screenplayId?: string,
  +createdBy: ?string,
  +favoritedBy: ?Array<string>, // userIds
  +createdAt: string,
  +updatedAt: string,
  +deletedAt: ?string,
  +uploadUrl?: string,
  +download?: Download
};

export type Search = {
  +query: string,
  +fileType: ?FileType,
  +fileIds: Array<string>
};

export const UploadStatuses = {
  PENDING: ("pending": "pending"),
  UPLOADING: ("uploading": "uploading"),
  SUCCESS: ("success": "success"),
  ERROR: ("error": "error")
};

export type UploadStatus = $Values<typeof UploadStatuses>;

export type Upload = {
  file: $Shape<{ ...File }>,
  loaded: number,
  total: number,
  status: UploadStatus,
  createdAt: number,
  updatedAt: number
};

export const ClipboardModes = {
  COPY: ("copy": "copy"),
  CUT: ("cut": "cut")
};

export type ClipboardMode = $Values<typeof ClipboardModes>;

export type Clipboard = {
  fileIds: Array<string>,
  mode: ClipboardMode
};

export type Selection = {
  fileIds: Array<string>,
  lastSelectedFileId: ?string
};

export type State = {
  +files: Array<File>,
  +search: Search,
  +selection: Selection,
  +clipboard: Clipboard,
  +uploads: Array<Upload>,
  +isFetching: boolean,
  +error: ?string,
  +moveToDialog: {
    +isFirstLevelFetched: boolean,
    +fetchedFolders: Array<string>,
    +productionToMove: ?number
  }
};

export const initialState: State = {
  files: [],
  search: {
    query: "",
    fileType: undefined,
    fileIds: []
  },
  selection: {
    fileIds: [],
    lastSelectedFileId: null
  },
  clipboard: {
    fileIds: [],
    mode: ClipboardModes.COPY
  },
  uploads: [],
  isFetching: false,
  error: undefined,
  moveToDialog: {
    isFirstLevelFetched: false,
    fetchedFolders: [],
    productionToMove: null
  }
};

/**
 * reducer.
 */
export default function reducer(
  state: State = initialState,
  action: GlobalFSA<*>
): State {
  switch (action.type) {
    case `${actions.FETCH_FOLDER_CONTENT}_PENDING`:
    case `${actions.FETCH_RECENT}_PENDING`:
    case `${actions.FETCH_FAVORITES}_PENDING`:
    case `${actions.FETCH_DELETED}_PENDING`:
    case `${actions.FETCH_FILE_PATH}_PENDING`:
      return reducers.fetchFilesPending(
        state,
        ((action: any): actions.FetchFilesAction)
      );

    case `${actions.FETCH_FOLDER_CONTENT}_FULFILLED`:
    case `${actions.FETCH_FAVORITES}_FULFILLED`:
    case `${actions.FETCH_RECENT}_FULFILLED`:
    case `${actions.FETCH_DELETED}_FULFILLED`:
    case `${actions.FETCH_FILE_PATH}_FULFILLED`:
      return reducers.fetchFilesFulfilled(
        state,
        ((action: any): actions.FetchFilesAction)
      );

    case `${actions.FETCH_FOLDER_CONTENT}_REJECTED`:
    case `${actions.FETCH_FAVORITES}_REJECTED`:
    case `${actions.FETCH_RECENT}_REJECTED`:
    case `${actions.FETCH_DELETED}_REJECTED`:
    case `${actions.FETCH_FILE_PATH}_REJECTED`:
      return reducers.fetchFilesRejected(
        state,
        ((action: any): actions.FetchFilesAction)
      );

    case actions.CLEAR_SEARCH:
      return reducers.clearSearch(
        state,
        ((action: any): actions.ClearSearchAction)
      );

    case actions.SEARCH_PENDING:
      return reducers.searchPending(
        state,
        ((action: any): actions.SearchActionPending)
      );

    case actions.SEARCH_FULFILLED:
      return reducers.searchFulfilled(
        state,
        ((action: any): actions.SearchActionFulfilled)
      );

    case actions.SEARCH_REJECTED:
      return reducers.searchRejected(
        state,
        ((action: any): actions.SearchActionRejected)
      );

    case actions.CREATE_FOLDER_PENDING:
      return reducers.createFolderPending(
        state,
        ((action: any): actions.CreateFolderActionPending)
      );

    case actions.CREATE_FOLDER_FULFILLED:
      return reducers.createFolderFulfilled(
        state,
        ((action: any): actions.CreateFolderActionFulfilled)
      );

    case actions.CREATE_FOLDER_REJECTED:
      return reducers.createFolderRejected(
        state,
        ((action: any): actions.CreateFolderActionRejected)
      );

    case actions.CREATE_SCREENPLAY_PENDING:
      return reducers.createScreenplayPending(
        state,
        ((action: any): actions.CreateScreenplayActionPending)
      );

    case actions.CREATE_SCREENPLAY_FULFILLED:
      return reducers.createScreenplayFulfilled(
        state,
        ((action: any): actions.CreateScreenplayActionFulfilled)
      );

    case actions.CREATE_SCREENPLAY_REJECTED:
      return reducers.createScreenplayRejected(
        state,
        ((action: any): actions.CreateScreenplayActionRejected)
      );

    case actions.TOGGLE_FAVORITE_PENDING:
      return reducers.toggleFavoritePending(
        state,
        ((action: any): actions.ToggleFavoriteActionPending)
      );

    case actions.TOGGLE_FAVORITE_FULFILLED:
      return reducers.toggleFavoriteFulfilled(
        state,
        ((action: any): actions.ToggleFavoriteActionFulfilled)
      );

    case actions.TOGGLE_FAVORITE_REJECTED:
      return reducers.toggleFavoriteRejected(
        state,
        ((action: any): actions.ToggleFavoriteActionRejected)
      );

    case actions.MOVE_FILES_PENDING:
      return reducers.moveFilesPending(
        state,
        ((action: any): actions.MoveFilesActionPending)
      );

    case actions.MOVE_FILES_FULFILLED:
      return reducers.moveFilesFulfilled(
        state,
        ((action: any): actions.MoveFilesActionFulfilled)
      );

    case actions.MOVE_FILES_REJECTED:
      return reducers.moveFilesRejected(
        state,
        ((action: any): actions.MoveFilesActionRejected)
      );

    case actions.RENAME_FILE_PENDING:
      return reducers.renameFilePending(
        state,
        ((action: any): actions.RenameFileActionPending)
      );

    case actions.RENAME_FILE_FULFILLED:
      return reducers.renameFileFulfilled(
        state,
        ((action: any): actions.RenameFileActionFulfilled)
      );

    case actions.RENAME_FILE_REJECTED:
      return reducers.renameFileRejected(
        state,
        ((action: any): actions.RenameFileActionRejected)
      );

    case actions.DELETE_FILE_PENDING:
      return reducers.deleteFilePending(
        state,
        ((action: any): actions.DeleteFileActionPending)
      );

    case actions.DELETE_FILE_FULFILLED:
      return reducers.deleteFileFulfilled(
        state,
        ((action: any): actions.DeleteFileActionFulfilled)
      );

    case actions.DELETE_FILE_REJECTED:
      return reducers.deleteFileRejected(
        state,
        ((action: any): actions.DeleteFileActionRejected)
      );

    case actions.RESTORE_FILE_PENDING:
      return reducers.restoreFilePending(
        state,
        ((action: any): actions.RestoreFileActionPending)
      );

    case actions.RESTORE_FILE_FULFILLED:
      return reducers.restoreFileFulfilled(
        state,
        ((action: any): actions.RestoreFileActionFulfilled)
      );

    case actions.RESTORE_FILE_REJECTED:
      return reducers.restoreFileRejected(
        state,
        ((action: any): actions.RestoreFileActionRejected)
      );

    case actions.TOGGLE_SELECTED:
      return reducers.toggleSelected(
        state,
        ((action: any): actions.ToggleSelectedAction)
      );

    case actions.FILE_REMOVED:
      return reducers.fileRemoved(
        state,
        ((action: any): actions.FileRemovedAction)
      );

    case actions.UPLOAD_FILE_PENDING:
      return reducers.uploadFilePending(
        state,
        ((action: any): actions.UploadFileActionPending)
      );

    case actions.UPLOAD_FILE_FULFILLED:
      return reducers.uploadFileFulfilled(
        state,
        ((action: any): actions.UploadFileActionFulfilled)
      );

    case actions.UPLOAD_FILE_REJECTED:
      return reducers.uploadFileRejected(
        state,
        ((action: any): actions.UploadFileActionRejected)
      );

    case actions.UPLOAD_FILE_PROGRESS:
      return reducers.uploadFileProgress(
        state,
        ((action: any): actions.UploadFileProgressAction)
      );

    case actions.DISMISS_UPLOAD:
      return reducers.dismissUpload(
        state,
        ((action: any): actions.DismissUploadAction)
      );

    case actions.DUPLICATE_FILE_PENDING:
      return reducers.duplicateFilePending(
        state,
        ((action: any): actions.DuplicateFileActionPending)
      );

    case actions.DUPLICATE_FILE_FULFILLED:
      return reducers.duplicateFileFulfilled(
        state,
        ((action: any): actions.DuplicateFileActionFulfilled)
      );

    case actions.DUPLICATE_FILE_REJECTED:
      return reducers.duplicateFileRejected(
        state,
        ((action: any): actions.DuplicateFileActionRejected)
      );

    case actions.COPY:
      return reducers.copy(state, ((action: any): actions.CopyAction));

    case actions.CUT:
      return reducers.cut(state, ((action: any): actions.CutAction));

    case actions.PASTE:
      return reducers.paste(state, ((action: any): actions.PasteAction));

    case actions.SELECT_PRODUCTION_TO_MOVE:
      return reducers.selectProductionToMove(
        state,
        ((action: any): actions.SelectProductionToMoveAction)
      );

    case actions.FETCH_FILE_PENDING:
      return reducers.fetchFilePending(state);

    case actions.FETCH_FILE_FULFILLED:
      return reducers.fetchFileFulfilled(
        state,
        ((action: any): actions.FetchFileActionFulfilled)
      );

    case actions.FETCH_FILE_REJECTED:
      return reducers.fetchFileRejected(
        state,
        ((action: any): actions.FetchFileActionRejected)
      );

    case actions.GET_DOWNLOAD_URL_PENDING:
      return reducers.getDownloadUrlPending(
        state,
        ((action: any): actions.GetDownloadUrlActionPending)
      );

    case actions.GET_DOWNLOAD_URL_FULFILLED:
      return reducers.getDownloadUrlFulfilled(
        state,
        ((action: any): actions.GetDownloadUrlActionFulfilled)
      );

    case actions.GET_DOWNLOAD_URL_REJECTED:
      return reducers.getDownloadUrlRejected(
        state,
        ((action: any): actions.GetDownloadUrlActionRejected)
      );

    default:
      return state;
  }
}
