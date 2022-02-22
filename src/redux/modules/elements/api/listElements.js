// @flow
import { mock, post, type APIResponseType } from "src/helpers/api";
import env from "config/env";
import { type Element, type RelatedObject } from "../";

const { MOCK_API, API_URL } = env;

export type ListElementsResponse = {|
  +elements: Array<Element>,
  +related_objects?: Array<RelatedObject>,
  +limit: number,
  +offset: number
|};

const listElementsResponseMock: ListElementsResponse = {
  elements: [
    {
      id: "1FUMGxpd1YyrsNAotw6hJ4XRJMh",
      version: 2,
      production_id: "1",
      name: "Edward Burns",
      category_id: "1FUMGsMqpp7KK3t612JQl7H4QIT",
      category_order: 0,
      category_type: null,
      category_name: null,
      related_id: "1",
      display_id: "0",
      shootingevents: [],
      shootingevents_scenes: [
        {
          shootingevent_id: "1FUMGv4bKc7fjymc6cfPCvgsCZu",
          scene_id: "1FUMGrEFcoYSiMxXQciIrTbRw2X",
          shootingevent_name: "2. INT. STAN'S APARTMENT - DAY",
          screenplay_id: "1FUMGuPaxCi3B38WF9mltR2UndX",
          set_id: "1FUMGqx65AkkPJw777uFQ1NES5G",
          set_name: "Stan's Apartment",
          scene_title: "INT. STAN'S APARTMENT - DAY",
          scene_sequence: 2,
          scene_code: "A2"
        }
      ],
      image_id: null,
      image_url: null,
      tags: null,
      items: null,
      max_quantity: 0,
      created_by: "50393f98-fe11-47e9-a237-8ecde9b02690",
      created_at: "2019-01-08T14:52:11Z",
      updated_at: "2019-01-08T14:52:11Z",
      deleted_at: null
    },
    {
      id: "1FUMGrjcZYVAtG29eKuypULj2wb",
      version: 2,
      production_id: "1",
      name: "Mr. Dr. Johnny Green",
      category_id: "1FUMGsMqpp7KK3t612JQl7H4QIT",
      category_order: 0,
      category_type: null,
      category_name: null,
      related_id: "2",
      display_id: "0",
      shootingevents: [
        {
          shootingevent_id: "1FUMGv4bKc7fjymc6cfPCvgsCZu",
          quantity: 0,
          shootingevent_name: "2. INT. STAN'S APARTMENT - DAY",
          screenplay_id: "1FUMGuPaxCi3B38WF9mltR2UndX",
          set_id: "1FUMGqx65AkkPJw777uFQ1NES5G",
          set_name: "Stan's Apartment"
        }
      ],
      shootingevents_scenes: [],
      image_id: null,
      image_url: null,
      tags: null,
      items: null,
      max_quantity: 0,
      created_by: "50393f98-fe11-47e9-a237-8ecde9b02690",
      created_at: "2019-01-08T14:52:11Z",
      updated_at: "2019-01-08T14:52:11Z",
      deleted_at: null
    }
  ],
  limit: 10,
  offset: 0,
  related_objects: [
    {
      id: "1",
      name: "role1"
    },
    {
      id: "2",
      name: "role2"
    }
  ]
};

export type ListElementsRequest = {|
  +productionId: string,
  +limit?: number,
  +offset?: number,
  +name?: string,
  +categoryId?: string,
  +setId?: string,
  +screenplayId?: string,
  +shootingEventId?: string,
  +sceneId?: string,
  +tags?: Array<string>,
  +includeRelatedObjects?: boolean
|};

export const listElements = ({
  productionId,
  limit = 100,
  offset = 0,
  name = "",
  categoryId = "",
  setId = "",
  screenplayId = "",
  shootingEventId = "",
  sceneId = "",
  tags,
  includeRelatedObjects = false
}: $Shape<{ ...ListElementsRequest }>): Promise<
  APIResponseType<ListElementsResponse>
> =>
  MOCK_API
    ? mock(listElementsResponseMock)
    : post(`${API_URL}/v1/productions/${productionId}/elements/list`, {
        limit,
        offset,
        name,
        category_id: categoryId,
        set_id: setId,
        screenplay_id: screenplayId,
        shootingevent_id: shootingEventId,
        scene_id: sceneId,
        tags,
        include_related_objects: includeRelatedObjects
      });

export default listElements;
