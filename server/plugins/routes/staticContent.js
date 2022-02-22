// @flow

export default {
  name: "staticContent",
  version: "1.0.0",
  register: (server: Object) => {
    server.route([
      {
        method: "GET",
        path: "/file-icons/{fileName}",
        handler: (request, h) => {
          const fileName = request.params.fileName;
          const fileExt = fileName.split(".").pop();

          if (!fileName || fileExt === fileName) {
            return h.file("build/public/images/fileicons/ext.png");
          }

          return h.file(`build/public/images/fileicons/${fileExt}.png`);
        }
      },
      {
        method: "GET",
        path: "/static/{param*}",
        handler: {
          directory: {
            path: "build/public",
            lookupCompressed: true
          }
        }
      },
      // Service workers and app cache
      {
        method: "GET",
        path: "/sw.js",
        handler: {
          file: "build/public/sw.js"
        }
      },
      {
        method: "GET",
        path: "/appcache/{param*}",
        handler: {
          directory: {
            path: "build/public/appcache"
          }
        }
      }
    ]);

    server.ext("onPreResponse", (request, h) => {
      if (request.path.indexOf("/file-icons/") === 0) {
        const response = request.response;

        if (response.isBoom && response.output.statusCode === 404) {
          return h.file("build/public/images/fileicons/ext.png").code(200);
        }
      }

      return h.continue;
    });
  }
};
