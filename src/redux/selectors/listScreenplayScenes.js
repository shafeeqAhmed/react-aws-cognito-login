// @flow
import { createSelector } from "reselect";
import elasticlunr from "elasticlunr";
import { get } from "lodash";
import listOrderedScreenplayScenes from "src/redux/selectors/listOrderedScreenplayScenes";
import type { RootReducerState } from "src/redux/modules";
import type { ScreenplayScene } from "src/redux/modules/screenplay";

function getScenes(state: RootReducerState): Array<ScreenplayScene> {
  return listOrderedScreenplayScenes(state);
}

function getFilter(state: RootReducerState): string {
  return get(state, "screenplay.sceneFilter", "");
}

const listScreenplayScenes = createSelector(
  [getScenes, getFilter],
  (scenes: Array<ScreenplayScene>, term: string) => {
    if (!term) return scenes;
    if (!scenes.length) return scenes;

    const index = elasticlunr(function schema() {
      this.setRef("sceneCode");
      this.addField("sceneTitle");
    });

    scenes.forEach(s => {
      index.addDoc(s);
    });

    const res = index.search(term, {
      fields: {
        sceneTitle: { boost: 2, bool: "AND" },
        sceneCode: { boost: 1 }
      },
      bool: "OR",
      expand: true
    });

    return res.map(r => scenes.find(s => s.sceneCode === r.ref));
  }
);

export default listScreenplayScenes;
