// @flow
import type { FetchFilePathAction } from "src/redux/modules/drive/actions/fetchFilePath";
import type { FetchFolderContentAction } from "src/redux/modules/drive/actions/fetchFolderContent";
import type { FetchRecentAction } from "src/redux/modules/drive/actions/fetchRecent";
import type { FetchFavoritesAction } from "src/redux/modules/drive/actions/fetchFavorites";
import type { FetchDeletedAction } from "src/redux/modules/drive/actions/fetchDeleted";
import type { SearchAction } from "src/redux/modules/drive/actions/search";

export type FetchFilesAction =
  | FetchFilePathAction
  | FetchFolderContentAction
  | FetchRecentAction
  | FetchFavoritesAction
  | FetchDeletedAction
  | SearchAction;
