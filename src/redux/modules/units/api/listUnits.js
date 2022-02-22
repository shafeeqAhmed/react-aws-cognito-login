/* eslint-disable camelcase */
// @flow
import { mock, post, type APIResponseType } from "src/helpers/api";
import env from "config/env";
import { type Unit } from "../";

const { MOCK_API, API_URL } = env;

type ListUnitsResponse = {|
  +units: Array<Unit>,
  +limit: number,
  +offset: number,
  +boneyard: {
    id: string,
    version: number,
    production_id: string,
    screenplay_id: string,
    name: string,
    shootingevents_count: number
  }
|};

const listUnitsResponseMock: ListUnitsResponse = {
  units: [
    {
      id: "1ARYwpbZ4NoB3VVNtX7E9aLrMZc",
      version: 1,
      production_id: "4",
      screenplay_id: "1A57Ptq9LRAeJjfoYH7E9SAZpZF",
      name: "Unit 1",
      shootingevents_count: 4,
      created_by: "8141b964-80dc-4993-a9cc-c79c145aefd7",
      created_at: "2018-09-19T21:05:20Z",
      updated_at: "2018-09-19T21:05:20Z",
      deleted_at: null
    }
  ],
  limit: 10,
  offset: 0,
  boneyard: {
    id: "",
    version: 1,
    production_id: "4",
    screenplay_id: "1A57Ptq9LRAeJjfoYH7E9SAZpZF",
    name: "Boneyard",
    shootingevents_count: 5
  }
};

export type ListUnitsRequest = {|
  productionId: string,
  screenplay_id?: string,
  limit?: number,
  offset?: number
|};

export const listUnits = ({
  productionId,
  screenplay_id,
  limit = 100,
  offset = 0
}: ListUnitsRequest): Promise<APIResponseType<ListUnitsResponse>> =>
  MOCK_API
    ? mock(listUnitsResponseMock)
    : post(`${API_URL}/v1/productions/${productionId}/units/list`, {
        screenplay_id,
        limit,
        offset
      });
export default listUnits;
