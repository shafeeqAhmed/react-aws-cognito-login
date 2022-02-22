// @flow
import { mock, post, type APIResponseType } from "src/helpers/api";
import env from "config/env";

const { MOCK_API, API_URL } = env;

export type CreateElementResponse = {
  id: string,
  version: number
};

const CreateElementResponseMock: CreateElementResponse = {
  id: "1C2LCqOdy0dfzZvRNgyCjbLOQ58",
  version: 1
};

export type CreateElementRequest = {|
  +productionId: string,
  +name: string,
  +categoryId: string,
  +relatedId?: ?string,
  +imageId?: ?string,
  +shootingEventId?: ?string,
  +quantity?: ?number
|};

export const createElement = ({
  productionId,
  name,
  categoryId: category_id,
  relatedId: related_id,
  imageId: image_id,
  shootingEventId: shootingevent_id,
  quantity
}: CreateElementRequest): Promise<APIResponseType<CreateElementResponse>> =>
  MOCK_API
    ? mock(CreateElementResponseMock)
    : post(`${API_URL}/v1/productions/${productionId}/elements/create`, {
        name,
        category_id,
        related_id,
        image_id,
        shootingevent_id,
        quantity
      });

export default createElement;
