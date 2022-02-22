// @flow
import { mock } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
// import env from "config/env";
import type { ContactsList } from "../";

// const { MOCK_WALKIE_API, WALKIE_API_URL } = env;

type GetContactsResponse = {
  +data: ContactsList
};

const GetContactsResponseMock: GetContactsResponse = {
  data: {
    "1": {
      id: "1",
      firstName: "Francis",
      lastName: "Abbey",
      email: "francisabbey@addres.com",
      avatar: {
        name: "avt7269d43e-6a01-4303-a921-8f31314f62ef-1534896434.jpg",
        sizeDesc: ["3x2"],
        urls: [
          "https://assets.entrepreneur.com/content/3x2/2000/20180509212515-ent18-june-kevinhart-1.jpeg"
        ]
      }
    },
    "2": {
      id: "2",
      firstName: "Alek",
      lastName: "Adamenko",
      email: "alekadamenko2@addres.com",
      avatar: null
    }
  }
};

export type GetContactsInput = {};

export type GetContactsOutput = {
  +data: ContactsList
};

/**
 * Decode API Response into application domain model.
 */
async function decoder(res: GetContactsResponse): Promise<GetContactsOutput> {
  return res;
}

/**
 * GetContacts returns a user profile
 * @params userId ID of the user, defaults to `me for the current user
 * @params id of the screenplay
 */
export default async function getContacts(
  input?: GetContactsInput
): Promise<APIResponseType<GetContactsOutput>> {
  const response = await mock(GetContactsResponseMock);

  const output: APIResponseType<GetContactsOutput> = {
    ...response,
    data: await decoder(response.data)
  };

  return output;
}
