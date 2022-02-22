// @flow
import { mock, post, type APIResponseType } from "src/helpers/api";
import env from "config/env";
import { type Element } from "../";

const { MOCK_API, API_URL } = env;

export type GetMetadataResponse = {|
  +element: Element
|};

const getMetadataResponseMock: GetMetadataResponse = {
  element: {
    id: "1FIySAlFXUtMlAd8gp7jyH2bbN7",
    version: 1,
    production_id: "1",
    name: "Jeep",
    category_id: "1FIySC37JBVisn5goJSttD9pw33",
    category_order: 1,
    category_type: "custom",
    category_name: "VEHICLES",
    related_id: "",
    display_id: "1",
    shootingevents: [],
    shootingevents_scenes: [],
    image_id: null,
    image_url: null,
    tags: null,
    items: [],
    max_quantity: 0,
    created_by: "50393f98-fe11-47e9-a237-8ecde9b02690",
    created_at: "2019-01-04T14:08:25Z",
    updated_at: "2019-01-04T14:08:25Z",
    deleted_at: null
  }
};

export type GetMetadataRequest = {|
  +productionId: string,
  +elementId?: string
|};

export const getMetadata = ({
  productionId,
  elementId
}: $Shape<{ ...GetMetadataRequest }>): Promise<
  APIResponseType<GetMetadataResponse>
> =>
  MOCK_API
    ? mock(getMetadataResponseMock)
    : post(`${API_URL}/v1/productions/${productionId}/elements/get_metadata`, {
        id: elementId
      });

export default getMetadata;
