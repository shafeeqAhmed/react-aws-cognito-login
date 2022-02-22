// @flow
import { mock, post, type APIResponseType } from "src/helpers/api";
import type { CategoryType } from "../";
import env from "config/env";

const { MOCK_API, API_URL } = env;

export type CreateCategoryResponse = {
  id: string,
  version: number
};

const CreateCategoryResponseMock: CreateCategoryResponse = {
  id: "1C2LCM8oUi9BwWdG2qZzGe65Zfw",
  version: 1
};

export type CreateCategoryRequest = {
  productionId: string,
  name: string,
  color: string,
  type: CategoryType
};

/**
 * createCategory creates a new element category.
 */
export const createCategory = ({
  productionId,
  ...body
}: CreateCategoryRequest): Promise<APIResponseType<CreateCategoryResponse>> =>
  MOCK_API
    ? mock(CreateCategoryResponseMock)
    : post(`${API_URL}/v1/productions/${productionId}/categories/create`, body);

export default createCategory;
