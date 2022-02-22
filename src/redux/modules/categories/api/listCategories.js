// @flow
import { mock, post, type APIResponseType } from "src/helpers/api";
import env from "config/env";
import { type Category } from "../";

const { MOCK_API, API_URL } = env;

export type ListCategoriesResponse = {|
  +categories: Array<Category>,
  +limit: number,
  +offset: number
|};

const listCategoriesResponseMock: ListCategoriesResponse = {
  categories: [
    {
      id: "1IpJPhi2k6aj173RpwvHZZbEbDp",
      version: 1,
      production_id: "1",
      name: "Props",
      color: "blue",
      type: "physical",
      created_by: "50393f98-fe11-47e9-a237-8ecde9b02690",
      created_at: "2019-03-22T21:19:43Z",
      updated_at: "2019-03-22T21:19:43Z",
      deleted_at: null
    },
    {
      id: "1IpJPj2Vm3VlYMNQ9KZ7odg0CLU",
      version: 1,
      production_id: "1",
      name: "Vehicles",
      color: "red",
      type: "physical",
      created_by: "50393f98-fe11-47e9-a237-8ecde9b02690",
      created_at: "2019-03-22T21:19:43Z",
      updated_at: "2019-03-22T21:19:43Z",
      deleted_at: null
    }
  ],
  limit: 10,
  offset: 0
};

export type ListCategoriesRequest = {|
  productionId: string,
  limit?: number,
  offset?: number
|};

export const listCategories = ({
  productionId,
  limit = 100,
  offset = 0
}: ListCategoriesRequest): Promise<APIResponseType<ListCategoriesResponse>> =>
  MOCK_API
    ? mock(listCategoriesResponseMock)
    : post(`${API_URL}/v1/productions/${productionId}/categories/list`, {
        limit,
        offset
      });

export default listCategories;
