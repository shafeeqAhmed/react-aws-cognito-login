// @flow
import { mock, post, type APIResponseType } from "src/helpers/api";
import env from "config/env";

const { MOCK_API, API_URL } = env;

export type UpdateElementResponse = {
  id: string,
  version: number
};

const UpdateElementResponseMock: UpdateElementResponse = {
  id: "1C2LCqOdy0dfzZvRNgyCjbLOQ58",
  version: 1
};

export type UpdateElementRequest = {|
  +productionId: string,
  +elementId: string,
  +name: string,
  +categoryOrder?: ?number,
  +relatedId?: ?string,
  +imageId?: ?string
|};

export const updateElement = ({
  productionId,
  elementId: id,
  name,
  categoryOrder: category_order,
  relatedId: related_id,
  imageId: image_id
}: UpdateElementRequest): Promise<APIResponseType<UpdateElementResponse>> =>
  MOCK_API
    ? mock(UpdateElementResponseMock)
    : post(`${API_URL}/v1/productions/${productionId}/elements/update`, {
        id,
        name,
        category_order,
        related_id,
        image_id
      });

export default updateElement;
