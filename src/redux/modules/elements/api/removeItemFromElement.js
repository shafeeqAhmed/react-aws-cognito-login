// @flow
import { mock, post, type APIResponseType } from "src/helpers/api";
import env from "config/env";

const { MOCK_API, API_URL } = env;

export type RemoveItemFromElementResponse = {
  id: string,
  version: number
};

const RemoveItemFromElementResponseMock: RemoveItemFromElementResponse = {
  id: "1C2LCqOdy0dfzZvRNgyCjbLOQ58",
  version: 1
};

export type RemoveItemFromElementRequest = {|
  +productionId: string,
  +elementId: string,
  +itemId: string
|};

export const removeItemFromElement = ({
  productionId,
  elementId: id,
  itemId: item_id
}: RemoveItemFromElementRequest): Promise<
  APIResponseType<RemoveItemFromElementResponse>
> =>
  MOCK_API
    ? mock(RemoveItemFromElementResponseMock)
    : post(`${API_URL}/v1/productions/${productionId}/elements/delete_item`, {
        id,
        item_id
      });

export default removeItemFromElement;
