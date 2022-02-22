// @flow
import { mock, post, type APIResponseType } from "src/helpers/api";
import env from "config/env";
import type { Forecast } from "../";

const { MOCK_API, API_URL } = env;

export type FetchForecastResponse = {|
  forecast: Forecast
|};

const fetchForecastResponseMock: FetchForecastResponse = {
  forecast: {
    latitude: "-34.901112",
    longitude: "-56.164532",
    time: "2018-12-12T12:00:00Z",
    icon: "cloudy",
    summary: "Mostly cloudy throughout the day.",
    sunrise_time: "2018-12-12T08:26:00Z",
    sunset_time: "2018-12-12T22:53:46Z",
    temperature: 69.61,
    temperature_high: 73.8,
    temperature_low: 63.78,
    wind_speed: 6.06,
    precip_probability: 0.06,
    created_at: "2018-12-13T15:07:32Z",
    updated_at: "2018-12-13T15:07:32Z"
  }
};

export type FetchForecastRequest = {|
  productionId: string,
  latitude: string,
  longitude: string,
  time: string,
  include_following_days: ?boolean
|};

export const fetchForecast = ({
  productionId,
  latitude,
  longitude,
  time,
  // eslint-disable-next-line camelcase
  include_following_days
}: FetchForecastRequest): Promise<APIResponseType<FetchForecastResponse>> =>
  MOCK_API
    ? mock(fetchForecastResponseMock)
    : post(`${API_URL}/v1/productions/${productionId}/weather/get_forecast`, {
        latitude,
        longitude,
        time,
        include_following_days
      });

export default fetchForecast;
