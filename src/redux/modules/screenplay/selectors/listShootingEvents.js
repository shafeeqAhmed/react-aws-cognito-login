// @flow
import { createSelector } from "reselect";
import { get, sortBy } from "lodash";
import type { RootReducerState } from "src/redux/modules";
import type { ShootingEvent } from "src/redux/modules/screenplay";

function getShootingEvents(state: RootReducerState): Array<ShootingEvent> {
  return get(state, "screenplay.shootingEvents", []);
}

function getSelectedUnitId(state: RootReducerState): ?string {
  return get(state, "units.selectedUnitId");
}

const listShootingEvents = createSelector(
  [getShootingEvents, getSelectedUnitId],
  (shootingEvents: Array<ShootingEvent>, unitId: ?string) => {
    if (!shootingEvents.length) return shootingEvents;

    const ses: Array<ShootingEvent> = shootingEvents.reduce((all, one) => {
      // filter
      if (one.mergedToId || one.deletedAt) return all;
      if (unitId && one.unitId !== unitId) return all;

      // fix splitCount
      let splitCount = 0;

      if (
        shootingEvents.find(
          s =>
            !s.deletedAt &&
            !s.mergedToId &&
            (s.splittedFromId === one.id || one.splittedFromId === s.id)
        )
      ) {
        splitCount = 1;
      }

      // sort scenes
      const scenes = sortBy(
        one.scenes,
        s => s.sceneId !== one.generatedFromSceneId,
        "sceneType"
      );

      return [...all, { ...one, splitCount, scenes }];
    }, []);

    // sort
    return sortBy(ses, ["sequence"]);
  }
);

export default listShootingEvents;
