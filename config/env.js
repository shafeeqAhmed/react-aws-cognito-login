// @flow
import vars from "config/variables";

const { fobReduxStateVar } = vars;

export type EnvState = {
  NODE_ENV: string,

  API_URL: string,
  MOCK_API: boolean,
  WALKIE_API_URL: string,
  MOCK_WALKIE_API: boolean,
  WIDGET_URL: string,
  ROOT_URL: string,
  USE_MOCK_API: boolean,
  SECURE_COOKIE: boolean,
  SHOW_ERRORS: boolean,
  ROBOTS_ALLOWED: boolean,
  HTTPS_REDIRECT: boolean,

  ROLLBAR_ENV: string,
  ROLLBAR_TOKEN: string,

  AWS_CLIENT_ID: string,
  AWS_IDENTITY_POOL_ID: string,
  AWS_USER_POOL_ID: string,
  AWS_APP_VERSION: string,
  AWS_REGION: string,

  INTERCOM_APP_ID: string
};

// Grab from env vars if they are set
const {
  NODE_ENV,

  API_URL,
  MOCK_API,
  WALKIE_API_URL,
  MOCK_WALKIE_API,
  WIDGET_URL,
  ROOT_URL,
  USE_MOCK_API,
  SECURE_COOKIE,
  SHOW_ERRORS,
  ROBOTS_ALLOWED,
  HTTPS_REDIRECT,

  ROLLBAR_ENV,
  ROLLBAR_TOKEN,

  AWS_CLIENT_ID,
  AWS_IDENTITY_POOL_ID,
  AWS_USER_POOL_ID,
  AWS_APP_VERSION,
  AWS_REGION,

  INTERCOM_APP_ID
} = process.env;

// Set defaults
const env: EnvState = {
  // Since NODE_ENV is automatically used by many plugins, we can't ensure it
  // will produce dev/prod parity by itself. Consequently, we need to use
  // separate ENVs for apps.
  NODE_ENV: NODE_ENV || "production",

  // App settings
  MOCK_API: MOCK_API === "true",
  MOCK_WALKIE_API: MOCK_WALKIE_API === "true",
  ROOT_URL: ROOT_URL || "http://localhost:3000",
  USE_MOCK_API: USE_MOCK_API === "true",
  SECURE_COOKIE: SECURE_COOKIE === "true",
  SHOW_ERRORS: SHOW_ERRORS === "true",
  ROBOTS_ALLOWED: ROBOTS_ALLOWED === "true",
  HTTPS_REDIRECT: HTTPS_REDIRECT === "true",

  // Rollbar.io
  ROLLBAR_ENV: ROLLBAR_ENV || "development",
  ROLLBAR_TOKEN: ROLLBAR_TOKEN || "9f311cc42b824365af6dbc45d7a40a80",

  // QA
  // API_URL: API_URL || "https://cojguj71i3.execute-api.us-east-1.amazonaws.com/qa",
  // WALKIE_API_URL: WALKIE_API_URL || "https://api-qa.productioncliq.com",
  // WIDGET_URL: WIDGET_URL || "https://procliq-walkie-widget-staging.herokuapp.com",
  // AWS_IDENTITY_POOL_ID: AWS_IDENTITY_POOL_ID || "us-east-1:f214fa7e-46a3-40d4-af3e-525815519d3c",
  // AWS_REGION: AWS_REGION || "us-east-1",
  // AWS_USER_POOL_ID: AWS_USER_POOL_ID || "us-east-1_setSHEKEz",
  // AWS_CLIENT_ID: AWS_CLIENT_ID || "lv6m5tcne9s00u0s339ihf6jh",
  // INTERCOM_APP_ID: INTERCOM_APP_ID || "m0klguaz",

  // DEV
  API_URL:
    API_URL || "https://9sdud0oj59.execute-api.us-east-1.amazonaws.com/dev",
  WALKIE_API_URL: WALKIE_API_URL || "https://api-dev.productioncliq.com",
  WIDGET_URL:
    WIDGET_URL || "https://procliq-walkie-widget-staging.herokuapp.com",
  AWS_IDENTITY_POOL_ID:
    AWS_IDENTITY_POOL_ID || "us-east-1:214c7a8c-9c25-491a-8b03-1274ebfb702d",
  AWS_REGION: AWS_REGION || "us-east-1",
  AWS_USER_POOL_ID: AWS_USER_POOL_ID || "us-east-1_9JIu6djQf",
  AWS_CLIENT_ID: AWS_CLIENT_ID || "31qoq9nb6m314vtl9t0r4fmg45",
  AWS_APP_VERSION: AWS_APP_VERSION || "1.2.4",
  INTERCOM_APP_ID: INTERCOM_APP_ID || "m0klguaz"
};

export const isBrowser = (): boolean =>
  Boolean(typeof window !== "undefined" && window.document);

const getEnv = (): EnvState => {
  if (NODE_ENV === "test") return env;
  if (isBrowser() && window[fobReduxStateVar]) {
    return window[fobReduxStateVar].env;
  }
  return env;
};

const dynamicEnv = getEnv();

export default dynamicEnv;
