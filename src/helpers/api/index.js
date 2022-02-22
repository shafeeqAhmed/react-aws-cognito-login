// @flow
import FetchPonyfill from "fetch-ponyfill";
import Debug from "debug";
import { getAuthToken } from "src/helpers/auth";
import { postFile } from "./postFile";
import env from "config/env";
import {
  mapValues,
  mapKeys,
  isObject,
  isArray,
  camelCase,
  get as getLodash
} from "lodash";
import sceneColor from "./sceneColor";
import type { ScreenplayScene } from "src/redux/modules/screenplay";

const { fetch } = FetchPonyfill();
const log = Debug("procliq:editor:web:helpers:api");

type FetchOpts = {
  method?: string,
  body?: string,
  headers?: Object,
  credentials?: string,
  url?: string
};

type FetchResponse = {|
  status: number,
  statusText: string,
  ok: boolean,
  headers: Object,
  url: string,
  text: () => Promise<string>,
  json: () => Promise<Object>
|};

export type APIResponseType<T> = {
  statusCode: number,
  data: T
};

// TODO: add support for generic types throughout the api helper
export type APIResponse = APIResponseType<Object>;

type client = (
  endpoint?: string,
  data?: ?Object | Array<Object>
) => Promise<APIResponse>;

const getClient = async (opts?: FetchOpts): Promise<client> => {
  let token: string = "";
  const url = (opts && opts.url) || env.API_URL;

  try {
    token = await getAuthToken();
  } catch (e) {
    log(e);
  }
  return async (endpoint?: string = "", data?: ?Object | Array<Object>) => {
    const path = endpoint || "";
    const prefix = path.substr(0, 8).indexOf("//") === -1 ? url : "";

    try {
      const response = await fetch(`${prefix}${path}`, {
        // const response = await fetch("http://httpstat.us/500", {
        body: data ? JSON.stringify(data) : undefined,
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          "Content-Type": "application/json"
        },
        ...opts
      });

      if (!response.ok) {
        const parsed = await _parseError(response);
        throw new Error(parsed);
      }
      return _parseResponse(response);
    } catch (error) {
      const parsed = await _parseError(error);
      throw new Error(parsed);
    }
  };
};

const _parseFetch = async (response: FetchResponse): Promise<APIResponse> => {
  log("_parseResponse: %o", response);

  const body = await response.text();

  try {
    return {
      statusCode: response.status,
      data: JSON.parse(body)
    };
  } catch (e) {
    // Catch any malformed JSON responses here
    return {
      statusCode: response.status,
      data: { text: body }
    };
  }
};

declare class FetchError extends Error {}

export type APIError = string;

// Standardize API error format across the app
// Decouple from implementation (here using axios)
const _parseError = async (
  error: FetchResponse | FetchError
): Promise<APIError> => {
  // DEBUG: Print implementation-specific error information
  log("_parseError: %s \n %o", error);

  if (error instanceof Error) {
    return error.message;
  } else if (error && error.status && typeof error.status === "number") {
    // If we have a non-ok response from the API
    const { data } = await _parseFetch(error);

    // Walkie/Directory error messages
    if (typeof data.message === "string") return data.message;
    // Some of the golang-based error message formats
    else if (data.error && typeof data.error.msg === "string")
      return data.error.msg;
    // Error response with an array of one or more errors
    else if (data.errors instanceof Array)
      return data.errors
        .filter(e => e.message)
        .map(e => e.message)
        .join(", ");
    // Non-JSON error messages
    else if (typeof data.text === "string") return data.text;
  }

  // Could not parse automatically
  return JSON.stringify(error);
};

// Standardize API response format across the app
// Decouple from implementation (here using axios)
const _parseResponse = async (
  response: FetchResponse
): Promise<APIResponse> => {
  log("_parseResponse: %o", response);

  return _parseFetch(response);
};

// GET request factories
export const get = (endpoint: string, opts?: FetchOpts): Promise<APIResponse> =>
  getClient(opts).then(c => c(endpoint));

// POST request factories
export const post = (
  endpoint: string,
  data: any,
  opts?: FetchOpts
): Promise<APIResponse> =>
  getClient({ method: "POST", ...opts }).then(c => c(endpoint, data));

// PATCH request factories
export const patch = (
  endpoint: string,
  data: ?Object = {},
  opts?: FetchOpts
): Promise<APIResponse> =>
  getClient({ method: "PATCH", ...opts }).then(c => c(endpoint, data));

// PUT request factories
export const put = (
  endpoint: string,
  data: ?Object = {},
  opts?: FetchOpts
): Promise<APIResponse> =>
  getClient({ method: "PUT", ...opts }).then(c => c(endpoint, data));

// DELETE request factories
export const del = (endpoint: string, opts?: FetchOpts): Promise<APIResponse> =>
  getClient({ method: "DELETE", ...opts }).then(c => c(endpoint));

export const mock = (data: Object, delay: number = 500): Promise<APIResponse> =>
  new Promise(resolve =>
    setTimeout(
      () =>
        resolve(
          _parseResponse({
            status: 200,
            statusText: "Success",
            text: () => Promise.resolve(JSON.stringify(data)),
            url: "",
            ok: true,
            json: () => Promise.resolve(data),
            headers: {}
          })
        ),
      delay
    )
  );

/**
 * Recursively convert object keys to camelCase.
 */
export function camelize(obj: Object) {
  if (typeof obj === "string") return obj;
  return mapValues(mapKeys(obj, (_, k) => camelCase(k)), val => {
    if (isArray(val)) {
      return val.map(camelize);
    } else if (isObject(val)) {
      return camelize(val);
    }
    return val;
  });
}

/**
 * Assign sceneColor
 */
export function assignSceneColor(
  scenes: Array<ScreenplayScene>
): Array<ScreenplayScene> {
  return scenes.map(scene => {
    const sceneTitle = getLodash(scene, "sceneTitle", "");
    const color = getSceneColor(sceneTitle);
    return { ...scene, color };
  });
}

export const postImageFile = (endpoint: string, fileBlob: Object): Promise<*> =>
  postFile(endpoint, fileBlob);

export function getSceneColor(name: string): string {
  const firstWord = name.substr(0, name.indexOf(".")).toUpperCase();

  const lastWord = name
    .substr(name.indexOf("-") + 2)
    .toUpperCase()
    .split(" ");

  return sceneColor[firstWord] && sceneColor[firstWord][lastWord[0]]
    ? sceneColor[firstWord][lastWord[0]]
    : "#FFF";
}
