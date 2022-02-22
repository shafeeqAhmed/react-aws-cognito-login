// @flow
/* eslint-disable no-console */
const { NODE_ENV, HTTPS_REDIRECT } = process.env;

// Hapi plugin signature
export default {
  name: "httpsRedirect",
  version: "1.0.0",
  register: (server: Object, options: Object) => {
    // Redirect to HTTPS
    server.ext("onRequest", (request, h) => {
      // Only if enabled
      if (HTTPS_REDIRECT !== "true") return h.continue;

      // Only in production
      if (NODE_ENV !== "production") return h.continue;

      // Headers set by AWS Elastic Beanstalk, Heroku, and other load balancers
      const redirect = request.headers["x-forwarded-proto"] === "http";
      const host = request.headers["x-forwarded-host"] || request.headers.host;
      // request.url.path should contain trailing URL elements like query
      // strings and hashes.
      // ref: https://github.com/hapijs/hapi/blob/7ffd301a3e0499df4c0989bd3aca7498bf314ee3/lib/request.js#L127
      const path = `https://${host}${request.url.path}`;

      if (redirect) {
        console.log(["http_redirect"], path);
        return h
          .response()
          .redirect(path)
          .code(301);
      }
      return h.continue;
    });
  }
};
