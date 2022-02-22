// @flow
import { createSelector } from "reselect";
import { get } from "lodash";
import type { Metadata } from "src/redux/modules/screenplay";
import type { File } from "src/redux/modules/drive";
import type { Production } from "src/redux/modules/productions";
import type { RootReducerState } from "src/redux/modules";

const getMetadata = (state: RootReducerState): Metadata =>
  get(state, "screenplay.screenplay.metadata", {});

const getProductions = (state: RootReducerState): Array<Production> =>
  get(state, "productions.productions", []);

const getSelectedProductionId = (state: RootReducerState): number =>
  get(state, "productions.activeProductionID", 2);

const getFiles = (state: RootReducerState): Array<File> =>
  get(state, "drive.files", []);

export type Breadcrumbs = {
  production: Production,
  files: Array<File>
};

const getScreenplayBreadcrumbs: (
  state: RootReducerState
) => ?Breadcrumbs = createSelector(
  [getMetadata, getProductions, getSelectedProductionId, getFiles],
  (
    metadata: Metadata,
    productions: Array<Production>,
    productionId: number,
    files: Array<File>
  ): ?Breadcrumbs => {
    const production = productions.find(p => p.id === productionId);
    if (!production) return null;

    const breadcrumbs: Breadcrumbs = { production, files: [] };
    const filesInProduction = files.filter(
      f => f.productionId === productionId
    );

    const getFile = (id: ?string) =>
      id && filesInProduction.find(f => f.id === id);
    let file = getFile(metadata.fileId);

    while (file) {
      breadcrumbs.files.unshift(file);
      file = getFile(file.folderId);
    }

    return breadcrumbs;
  }
);

export default getScreenplayBreadcrumbs;
