// @flow
import { mock, post, type APIResponseType } from "src/helpers/api";
import env from "config/env";

const { MOCK_API, API_URL } = env;

export type DeleteElementResponse = {
  id: string,
  version: number
};

const DeleteElementResponseMock: DeleteElementResponse = {
  id: "1C2LCqOdy0dfzZvRNgyCjbLOQ58",
  version: 1
};

export type DeleteElementRequest = {|
  +productionId: string,
  +elementId: string
|};

export const deleteElement = ({
  productionId,
  elementId: id
}: DeleteElementRequest): Promise<APIResponseType<DeleteElementResponse>> =>
  MOCK_API
    ? mock(DeleteElementResponseMock)
    : post(`${API_URL}/v1/productions/${productionId}/elements/delete`, {
        id
      });

export default deleteElement;
