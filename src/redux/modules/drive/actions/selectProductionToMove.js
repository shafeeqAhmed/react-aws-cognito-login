// @flow

export const SELECT_PRODUCTION_TO_MOVE = ("procliq-web-editor/drive/SELECT_PRODUCTION_TO_MOVE": "procliq-web-editor/drive/SELECT_PRODUCTION_TO_MOVE");

export type SelectProductionToMoveAction = {
  type: typeof SELECT_PRODUCTION_TO_MOVE,
  payload: { productionId: number }
};

export const selectProductionToMove = (
  productionId: number
): SelectProductionToMoveAction => ({
  type: SELECT_PRODUCTION_TO_MOVE,
  payload: { productionId }
});
