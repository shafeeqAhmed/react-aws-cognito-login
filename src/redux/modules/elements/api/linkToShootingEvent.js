// @flow
import { mock, post, type APIResponseType } from "src/helpers/api";
import env from "config/env";

const { MOCK_API, API_URL } = env;

export type LinkToShootingEventResponse = {|
  +id: string,
  +version: number
|};

const LinkToShootingEventResponseMock: LinkToShootingEventResponse = {
  id: "1C2LCqOdy0dfzZvRNgyCjbLOQ58",
  version: 1
};

export type LinkToShootingEventRequest = {|
  +productionId: string,
  +elementId: string,
  +shootingEventId: string,
  +quantity?: number
|};

export const linkToShootingEvent = ({
  productionId,
  elementId,
  shootingEventId,
  quantity = 1
}: LinkToShootingEventRequest): Promise<
  APIResponseType<LinkToShootingEventResponse>
> =>
  MOCK_API
    ? mock(LinkToShootingEventResponseMock)
    : post(
        `${API_URL}/v1/productions/${productionId}/elements/link_to_shootingevent`,
        {
          id: elementId,
          shootingevent_id: shootingEventId,
          quantity
        }
      );

export default linkToShootingEvent;
