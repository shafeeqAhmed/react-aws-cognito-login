// @flow
import { get } from "lodash";
import type { State } from "../";
import type { SelectProductionToMoveAction } from "src/redux/modules/drive/actions";

export default function toggleSelected(
  state: State,
  action: SelectProductionToMoveAction
): State {
  const productionToMove = get(action, "payload.productionId");
  return {
    ...state,
    moveToDialog: {
      ...state.moveToDialog,
      productionToMove
    }
  };
}
