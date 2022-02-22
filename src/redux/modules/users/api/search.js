// @flow
import { mock, get, camelize, type APIResponseType } from "src/helpers/api";
import {
  type UserProfile,
  type UserTag,
  type Department
} from "src/redux/modules/users";
import env from "config/env";

const { MOCK_WALKIE_API, WALKIE_API_URL } = env;

type SearchRequest = {
  production_id: number,
  q: string,
  type: Array<"USER" | "TAG" | "DEPARTMENT">, // ALSO: "HASHBLAST" | "CHANNEL" | "ROLE"
  limit?: number,
  offset?: number
};

type SearchResponse = {
  items: {
    USER: Array<{
      id: string,
      firstName: ?string,
      lastName: ?string,
      email: string,
      avatar: {
        name: string,
        sizeDesc: Array<string>,
        urls: Array<string>
      },
      status: "ACCEPTED",
      roles: Array<{
        id: number,
        name: string,
        department: {
          id: number,
          name: string,
          type: "CREW" | "CAST" | "EXTRAS"
        }
      }>,
      tags: Array<{
        id: number,
        name: string
      }>
    }>,
    DEPARTMENT: Array<{
      id: number,
      name: string,
      type: "CREW" | "CAST" | "EXTRAS"
    }>,
    TAG: Array<{
      id: number,
      name: string
    }>
  },
  nextOffset: ?number
};

const SearchResponseMock: SearchResponse = {
  nextOffset: null,
  items: {
    USER: [
      {
        id: "c9329c9f-e44b-478c-969e-31f0d4e13066",
        firstName: "Kyle",
        lastName: "Borba",
        email: "pqr10c@mailinator.com",
        avatar: {
          name: "avtc9329c9f-e44b-478c-969e-31f0d4e13066-1536659109.jpg",
          sizeDesc: ["300", "600"],
          urls: [
            "https://s3.amazonaws.com/procliq-directory-dev/users/c9329c9f-e44b-478c-969e-31f0d4e13066/avatar/300/avtc9329c9f-e44b-478c-969e-31f0d4e13066-1536659109.jpg",
            "https://s3.amazonaws.com/procliq-directory-dev/users/c9329c9f-e44b-478c-969e-31f0d4e13066/avatar/600/avtc9329c9f-e44b-478c-969e-31f0d4e13066-1536659109.jpg"
          ]
        },
        status: "ACCEPTED",
        roles: [],
        tags: []
      }
    ],
    DEPARTMENT: [
      {
        id: 37,
        name: "Principal",
        type: "CAST"
      },
      {
        id: 26,
        name: "Production Office",
        type: "CREW"
      }
    ],
    TAG: [
      {
        id: 23,
        name: "Toronto"
      }
    ]
  }
};

export type SearchInput = {
  productionId: number,
  query: string,
  type?: Array<"USER" | "TAG" | "DEPARTMENT">,
  limit?: number,
  offset?: number
};

export type SearchOutput = {
  users: Array<UserProfile>,
  tags: Array<UserTag>,
  departments: Array<Department>,
  nextOffset: ?number
};

/**
 * encodes a `SearchInput` object to an api request.
 */
async function encoder(input: SearchInput): Promise<SearchRequest> {
  return {
    production_id: input.productionId,
    q: input.query,
    type: input.type || ["USER", "TAG", "DEPARTMENT"],
    limit: typeof input.limit === "undefined" ? 50 : input.limit,
    offset: typeof input.offset === "undefined" ? 0 : input.offset
  };
}

/**
 * decodes the api response to `SearchOutput`.
 */
async function decoder(
  res: SearchResponse,
  input: SearchInput
): Promise<SearchOutput> {
  const { items, ...r } = res;
  const { USER, DEPARTMENT, TAG } = items;

  const users = USER.map(camelize);
  const departments = DEPARTMENT.map(camelize);
  const tags = TAG.map(camelize);

  return { ...r, users, departments, tags };
}

/**
 * search returns a paginated list of entities matching a query.
 */
export default async function search(
  input: SearchInput
): Promise<APIResponseType<SearchOutput>> {
  // eslint-disable-next-line camelcase
  const { production_id, ...params } = await encoder(input);

  // Skip api call if query is empty.
  const { q } = params;
  if (!q) {
    return {
      statusCode: 200,
      data: { nextOffset: null, tags: [], departments: [], users: [] }
    };
  }

  // eslint-disable-next-line no-undef
  const url = new URL(
    // eslint-disable-next-line camelcase
    `${WALKIE_API_URL}/directory/productions/${production_id}/search`
  );

  Object.keys(params).forEach(k => {
    const value = params[k];

    if (Array.isArray(value)) {
      value.forEach(v => url.searchParams.append(k, v));
    } else if (value) {
      url.searchParams.append(k, encodeURIComponent(`${value}`));
    }
  });

  const response = await (MOCK_WALKIE_API
    ? mock(SearchResponseMock)
    : get(url.toString()));

  const output: APIResponseType<SearchOutput> = {
    ...response,
    data: await decoder(response.data, input)
  };

  return output;
}
