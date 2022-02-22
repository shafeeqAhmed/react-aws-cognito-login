// @flow
import { mock, post, type APIResponseType } from "src/helpers/api";
import env from "config/env";
import type { ElementItemType } from "../";

const { MOCK_API, API_URL } = env;

export type AddItemToElementResponse = {
  id: string,
  version: number
};

const AddItemToElementResponseMock: AddItemToElementResponse = {
  id: "1C2LCqOdy0dfzZvRNgyCjbLOQ58",
  version: 1
};

export type AddItemToElementRequest = {|
  +productionId: string,
  +elementId: string,
  +itemType: ElementItemType,
  +itemId: string
|};

export const addItemToElement = ({
  productionId,
  elementId: id,
  itemType: item_type,
  itemId: item_id
}: AddItemToElementRequest): Promise<
  APIResponseType<AddItemToElementResponse>
> =>
  MOCK_API
    ? mock(AddItemToElementResponseMock)
    : post(`${API_URL}/v1/productions/${productionId}/elements/add_item`, {
        id,
        item_type,
        item_id
      });

export default addItemToElement;
