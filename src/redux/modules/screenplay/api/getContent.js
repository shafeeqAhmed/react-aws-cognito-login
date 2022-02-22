// @flow
import { camelize, mock, post } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import type { Content } from "src/redux/modules/screenplay";
import env from "config/env";

const { MOCK_API, API_URL } = env;

type GetContentResponse = {
  content: Array<{
    format:
      | ""
      | "action"
      | "act-start"
      | "act-end"
      | "character"
      | "dialogue"
      | "scene"
      | "transition"
      | "parenthetical",
    content: Array<{
      text: string,
      attrs: ?{ [name: string]: string }
    }>
  }>
};

const GetContentResponseMock: GetContentResponse = {
  content: [
    {
      format: "act-start",
      content: [
        {
          text: "BRICK & STEEL",
          attrs: null
        }
      ]
    },
    {
      format: "",
      content: [
        {
          text: "",
          attrs: null
        }
      ]
    },
    {
      format: "scene",
      content: [
        {
          text: "EXT. BRICK'S PATIO - DAY",
          attrs: null
        }
      ]
    },
    {
      format: "",
      content: [
        {
          text: "",
          attrs: null
        }
      ]
    },
    {
      format: "action",
      content: [
        {
          text:
            "A gorgeous day. The sun is shining. But BRICK BRADDOCK, retired police detective, is sitting quietly, contemplating -- something.",
          attrs: null
        }
      ]
    }
  ]
};

export type GetContentInput = {
  productionId: string,
  id: string
};

export type GetContentOutput = {
  content: Content
};

/**
 * decodes the api response to `GetMetadataOutput`.
 */
async function decoder(res: GetContentResponse): Promise<GetContentOutput> {
  return camelize(res);
}

/**
 * getContent fetches the content of a screenplay.
 * @params productionId ID of the production
 * @params id of the screenplay
 */
export default (async function getContent({
  productionId,
  id
}: GetContentInput): Promise<APIResponseType<GetContentOutput>> {
  const response = await (MOCK_API
    ? mock(GetContentResponseMock)
    : post(
        `${API_URL}/v1/productions/${productionId}/screenplays/get_content`,
        { id }
      ));

  const output: APIResponseType<GetContentOutput> = {
    ...response,
    data: await decoder(response.data)
  };

  return output;
});
