// @flow
import { mock, post, type APIResponseType } from "src/helpers/api";
import env from "config/env";
import { type Color } from "../";

const { MOCK_API, API_URL } = env;

export type ListColorsResponse = {|
  +colors: Array<Color>
|};

const listColorsResponseMock: ListColorsResponse = {
  colors: []
};

export type ListColorsRequest = {|
  productionId: string
|};

export const listColors = ({
  productionId
}: ListColorsRequest): Promise<APIResponseType<ListColorsResponse>> =>
  MOCK_API
    ? mock(listColorsResponseMock)
    : post(`${API_URL}/v1/productions/${productionId}/colors/list`, {});

export default listColors;
