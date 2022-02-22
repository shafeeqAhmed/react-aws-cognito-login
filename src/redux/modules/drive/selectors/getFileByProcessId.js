// @flow
import { createSelector } from "reselect";
import { find, get } from "lodash";
import type { File } from "src/redux/modules/drive";
import type { RootReducerState } from "src/redux/modules";

function getFiles(state: RootReducerState): Array<File> {
  return state.drive.files;
}

function getProcessId(_: RootReducerState, processId: string): string {
  return processId;
}

const getFileByProcessId = createSelector(
  [getFiles, getProcessId],
  (files: Array<File>, processId: string) =>
    find(files, f => get(f, "download.processId") === processId)
);

export default getFileByProcessId;
