// @flow
import { createSelector } from "reselect";
import moment from "moment";
import { compose, filter, reverse, sortBy } from "lodash/fp";
import type { Upload } from "src/redux/modules/drive";
import type { RootReducerState } from "src/redux/modules";

function getUploads(state: RootReducerState): Array<Upload> {
  return state.drive.uploads;
}

function getActiveProductionId(state: RootReducerState): ?number {
  return state.productions.activeProductionID;
}

const listActiveUploads = createSelector(
  [getUploads, getActiveProductionId],
  (uploads: Array<Upload>, productionId: ?number) =>
    compose([
      filter(
        u =>
          productionId &&
          u.file.productionId === productionId &&
          (u.status !== "done" ||
            moment(u.updatedAt).isAfter(moment().subtract(5, "minutes")))
      ),
      sortBy("createdAt"),
      reverse
    ])(uploads)
);

export default listActiveUploads;
