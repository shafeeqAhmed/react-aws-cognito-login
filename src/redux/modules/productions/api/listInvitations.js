// @flow
import { get, mock, type APIResponseType } from "src/helpers/api";
import env from "config/env";
import { type Invitation, type InvitationStatus } from "../";

const { MOCK_WALKIE_API, WALKIE_API_URL } = env;

type ListInvitationsRequest = {
  extraCodes?: ?Array<string>,
  offset?: ?number,
  statuses?: ?Array<string> // "PENDING" | "ACCEPTED" | "REJECTED" | "LEFT" | "REMOVED">
};

type ListInvitationsResponse = {
  +items: Array<{
    +id: number,
    +code: string,
    +date: string,
    +production: {
      +id: number,
      +name: string,
      +permission: "USER" | "ADMIN" | "SUPER_ADMIN",
      +poster?: ?{
        +name: string,
        +sizeDesc: Array<string>,
        +urls: Array<string>
      },
      +team?: ?{
        +id: number,
        +name: string,
        +role?: string
      }
    },
    +status: "PENDING" | "ACCEPTED" | "REJECTED" | "LEFT" | "REMOVED",
    +user: {
      +id: string,
      +avatar?: ?{
        +name: string,
        +sizeDesc: Array<string>,
        +urls: Array<string>
      },
      +email: string,
      +firstName: string,
      +lastName: string
    }
  }>,
  +nextOffset: number
};

const ListInvitationsResponseMock: ListInvitationsResponse = {
  items: [
    {
      code: "string",
      date: "2018-09-06T15:25:51.682Z",
      id: 0,
      production: {
        id: 0,
        name: "Dancing with Astronauts",
        permission: "USER",
        poster: {
          name: "p40-1510000310.jpg",
          sizeDesc: ["1"],
          urls: [
            "http://static.hd-trailers.net/images/the-martian-104112-poster-xlarge.jpg"
          ]
        },
        team: {
          id: 1,
          name: "Arcanum Pictures"
        }
      },
      status: "PENDING",
      user: {
        avatar: {
          name: "string",
          sizeDesc: ["string"],
          urls: ["string"]
        },
        email: "string",
        firstName: "Paul",
        id: "user1",
        lastName: "Gandersman"
      }
    },
    {
      code: "string",
      date: "2018-09-06T15:25:51.682Z",
      id: 1,
      production: {
        id: 2,
        name: "Lemony Snicket’s A Series of Unfortunate Events",
        permission: "USER",
        poster: {
          name: "p40-1510000310.jpg",
          sizeDesc: ["550"],
          urls: [
            "https://ih0.redbubble.net/image.316046115.5099/flat,550x550,075,f.u1.jpg"
          ]
        },
        team: {
          id: 1,
          name: "Netflix Studios"
        }
      },
      status: "PENDING",
      user: {
        avatar: {
          name: "string",
          sizeDesc: ["string"],
          urls: ["string"]
        },
        email: "string",
        firstName: "Mark",
        id: "user2",
        lastName: "Hudis"
      }
    }
  ],
  nextOffset: 0
};

export type ListInvitationsInput = {
  extraCodes?: ?Array<string>,
  offset?: ?number,
  statuses?: ?Array<InvitationStatus>
};

export type ListInvitationsOutput = {
  +invitations: Array<Invitation>
};

async function encoder(input: ListInvitationsInput): ListInvitationsRequest {
  return input;
}

async function decoder(
  res: ListInvitationsResponse
): Promise<ListInvitationsOutput> {
  return { invitations: res.items };
}

/**
 * listInvitations lists the productions the current user has been invited to.
 */
export default async function listInvitations(
  input: ListInvitationsInput
): Promise<APIResponseType<ListInvitationsOutput>> {
  const params = await encoder(input);

  // eslint-disable-next-line no-undef
  const url = new URL(`${WALKIE_API_URL}/directory/invitations`);

  Object.keys(params).forEach(k => {
    const value = params[k];

    if (Array.isArray(value)) {
      value.forEach(v => url.searchParams.append(k, v));
    } else if (value) {
      url.searchParams.append(k, encodeURIComponent(`${value}`));
    }
  });

  const response = await (MOCK_WALKIE_API
    ? mock(ListInvitationsResponseMock)
    : get(url.toString()));

  const output: APIResponseType<ListInvitationsOutput> = {
    ...response,
    data: await decoder(response.data)
  };

  return output;
}
