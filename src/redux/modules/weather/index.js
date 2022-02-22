// @flow
import * as api from "./api";
import get from "lodash/get";

export const FETCH_FORECAST: "procliq-web-editor/weather/FETCH_FORECAST" =
  "procliq-web-editor/weather/FETCH_FORECAST";

export const IconTypes = {
  "clear-day": ("clear-day": "clear-day"),
  "clear-night": ("clear-night": "clear-night"),
  rain: ("rain": "rain"),
  snow: ("snow": "snow"),
  sleet: ("sleet": "sleet"),
  wind: ("wind": "wind"),
  fog: ("fog": "fog"),
  cloudy: ("cloudy": "cloudy"),
  "partly-cloudy-day": ("partly-cloudy-day": "partly-cloudy-day"),
  "partly-cloudy-night": ("partly-cloudy-night": "partly-cloudy-night"),
  hail: ("hail": "hail"),
  thunderstorm: ("thunderstorm": "thunderstorm"),
  tornado: ("tornado": "tornado")
};

export type ForecastIconType = $Values<typeof IconTypes>;

export type Forecast = {
  latitude: string,
  longitude: string,
  time: string,
  icon: ForecastIconType,
  summary: string,
  sunrise_time: string,
  sunset_time: string,
  temperature: number,
  temperature_high: number,
  temperature_low: number,
  wind_speed: number,
  precip_probability: number,
  created_at: string,
  updated_at: string
};

export type State = {|
  +isFetching: boolean,
  +forecast: Array<Forecast>,
  +error: ?string
|};

const initialState = {
  isFetching: false,
  error: "",
  forecast: []
};

export default function reducer(
  state: State = initialState,
  action: GlobalFSA<*>
): State {
  switch (action.type) {
    case `${FETCH_FORECAST}_PENDING`:
      return {
        ...state,
        isFetching: true
      };

    case `${FETCH_FORECAST}_FULFILLED`:
      return {
        ...state,
        isFetching: false,
        forecast: get(action, "payload.data.forecast", [])
      };

    case `${FETCH_FORECAST}_REJECTED`:
      return {
        ...state,
        isFetching: false,
        error: action.payload
      };

    default:
      return state;
  }
}

export const fetchForecast = (request: api.FetchForecastRequest) => ({
  type: FETCH_FORECAST,
  payload: api.fetchForecast(request)
});
