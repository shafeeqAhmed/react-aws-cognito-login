// @flow
import Nock from "nock";
import _get from "lodash/get";
import {
  get,
  post,
  patch,
  put,
  del,
  mock,
  camelize,
  assignSceneColor,
  type APIError
} from "./";

it("get fetches via GET", async () => {
  const payload = { test: "success" };

  Nock("http://www.example.com", {
    reqheaders: {
      "Content-Type": "application/json"
    }
  })
    .get("/users")
    .reply(200, payload);

  const res = await get("http://www.example.com/users");

  expect(res.data).toEqual({ test: "success" });
  expect(res.statusCode).toEqual(200);
});

it("get supports non-JSON responses", async () => {
  Nock("http://www.example.com")
    .get("/users")
    .reply(200, "<test>Success!</test>");

  const res = await get("http://www.example.com/users");

  expect(_get(res, "data.text")).toEqual("<test>Success!</test>");
  expect(res.statusCode).toEqual(200);
});

it("post fetches via POST and passes payload", async () => {
  const payload = { test: "success" };

  Nock("http://www.example.com", {
    reqheaders: {
      "Content-Type": "application/json"
    }
  })
    .post("/users", payload)
    .reply(201, payload);

  const res = await post("http://www.example.com/users", payload);

  expect(res.data).toEqual(payload);
  expect(res.statusCode).toEqual(201);
});

it("patch fetches via PATCH and passes payload", async () => {
  const payload = { test: "success" };

  Nock("http://www.example.com", {
    reqheaders: {
      "Content-Type": "application/json"
    }
  })
    .patch("/users", payload)
    .reply(201, payload);

  const res = await patch("http://www.example.com/users", payload);

  expect(res.data).toEqual(payload);
  expect(res.statusCode).toEqual(201);
});

it("put fetches via PUT and passes payload", async () => {
  const payload = { test: "success" };

  Nock("http://www.example.com", {
    reqheaders: {
      "Content-Type": "application/json"
    }
  })
    .put("/users", payload)
    .reply(201, payload);

  const res = await put("http://www.example.com/users", payload);

  expect(res.data).toEqual(payload);
  expect(res.statusCode).toEqual(201);
});

it("del fetches via DELETE", async () => {
  const payload = { test: "success" };

  Nock("http://www.example.com", {
    reqheaders: {
      "Content-Type": "application/json"
    }
  })
    .delete("/users")
    .reply(201, payload);

  const res = await del("http://www.example.com/users");

  expect(res.data).toEqual(payload);
  expect(res.statusCode).toEqual(201);
});

it("mock returns mocked data on a delay", async () => {
  const payload = { test: "success" };

  const res = await mock(payload, 10);

  expect(res.data).toEqual(payload);
  expect(res.statusCode).toEqual(200);
});

describe("errors", () => {
  // TODO: refactor error tests to data-based approach like `camelize` and
  // `assignSceneColor` tests

  it("400 response returns parsed and encoded Error", async () => {
    const payload = { message: "error message from API" };

    Nock("http://www.example.com", {
      reqheaders: {
        "Content-Type": "application/json"
      }
    })
      .get("/users")
      .reply(400, payload);

    const expected: APIError = payload.message;

    try {
      // eslint-disable-next-line no-unused-vars
      const res = await get("http://www.example.com/users");
      throw new Error("Was supposed to throw");
    } catch (err) {
      expect(err.message).toEqual(expected);
    }
  });

  it("500 response returns parsed and encoded Error", async () => {
    const payload = { message: "error message from API" };

    Nock("http://www.example.com", {
      reqheaders: {
        "Content-Type": "application/json"
      }
    })
      .get("/users")
      .reply(500, payload);

    const expected: APIError = payload.message;

    try {
      // eslint-disable-next-line no-unused-vars
      const res = await get("http://www.example.com/users");
      throw new Error("Was supposed to throw");
    } catch (err) {
      expect(err.message).toEqual(expected);
    }
  });

  it("Network error returns parsed and encoded Error with 501 status", async () => {
    try {
      // eslint-disable-next-line no-unused-vars
      const res = await get("http://error");
      throw new Error("Was supposed to throw");
    } catch (err) {
      expect(typeof err.message).toEqual("string");
    }
  });

  it("parses backend error messages in data.error.msg", async () => {
    const payload = {
      error: {
        err: "not found",
        code: 404,
        msg: "error message from API"
      }
    };

    Nock("http://www.example.com", {
      reqheaders: {
        "Content-Type": "application/json"
      }
    })
      .get("/users")
      .reply(404, payload);

    const expected: APIError = payload.error.msg;

    try {
      // eslint-disable-next-line no-unused-vars
      const res = await get("http://www.example.com/users");
      throw new Error("Was supposed to throw");
    } catch (err) {
      expect(err.message).toEqual(expected);
    }
  });

  it("parses backend error messages with arrays of errors", async () => {
    const payload = {
      errors: [
        {
          error: "team.subdomain.not.unique",
          extras: null,
          message: "Subdomain is already in use"
        }
      ]
    };

    Nock("http://www.example.com", {
      reqheaders: {
        "Content-Type": "application/json"
      }
    })
      .get("/users")
      .reply(400, payload);

    const expected: APIError = payload.errors[0].message;

    try {
      // eslint-disable-next-line no-unused-vars
      const res = await get("http://www.example.com/users");
      throw new Error("Was supposed to throw");
    } catch (err) {
      expect(err.message).toEqual(expected);
    }
  });

  it("parses backend error messages with arrays of multiple errors", async () => {
    const payload = {
      errors: [
        {
          error: "team.subdomain.not.unique",
          extras: null,
          message: "Subdomain is already in use"
        },
        {
          error: "team.subdomain.not.unique",
          extras: null,
          message: "Subdomain is already in use"
        }
      ]
    };

    Nock("http://www.example.com", {
      reqheaders: {
        "Content-Type": "application/json"
      }
    })
      .get("/users")
      .reply(400, payload);

    const expected = `${payload.errors[0].message}, ${
      payload.errors[1].message
    }`;

    try {
      // eslint-disable-next-line no-unused-vars
      const res = await get("http://www.example.com/users");
      throw new Error("Was supposed to throw");
    } catch (err) {
      expect(err.message).toEqual(expected);
    }
  });
});

describe("camelize", () => {
  const testData = [
    {
      t: "simple",
      i: { file_type: "screenplay" },
      o: { fileType: "screenplay" }
    },
    {
      t: "already camelCased",
      i: { fileType: "upload" },
      o: { fileType: "upload" }
    },
    {
      t: "array of string",
      i: { fileType: ["upload", "upload"] },
      o: { fileType: ["upload", "upload"] }
    },
    {
      t: "deeply nested",
      i: {
        fileType: "upload",
        some_things: [{ nest_this: { deep_ly: "o_k" } }]
      },
      o: { fileType: "upload", someThings: [{ nestThis: { deepLy: "o_k" } }] }
    }
  ];
  testData.forEach(t => {
    it(`camelize ${t.t}`, () => {
      expect(camelize(t.i)).toEqual(t.o);
    });
  });
});

describe("assignSceneColor", () => {
  const testData = [
    {
      t: "Simple",
      i: [
        {
          sceneTitle: "EXT. BRICK'S PATIO - DAY",
          sceneId: "14mTUn1ozyX2RZQN0oAjglpgnXQ",
          lineNum: 2,
          sceneCode: "1",
          sceneOmitted: false,
          sceneLocked: false
        }
      ],
      o: [
        {
          sceneTitle: "EXT. BRICK'S PATIO - DAY",
          sceneId: "14mTUn1ozyX2RZQN0oAjglpgnXQ",
          lineNum: 2,
          sceneCode: "1",
          color: "#FFF8C3",
          sceneOmitted: false,
          sceneLocked: false
        }
      ]
    },
    {
      t: "default",
      i: [
        {
          sceneTitle: "EXT. WOODEN SHACK - MORNING",
          sceneId: "13kMRibhC1MvrqrO5LNmP5RJScM",
          lineNum: 10,
          sceneCode: "A1",
          sceneOmitted: false,
          sceneLocked: false
        }
      ],
      o: [
        {
          sceneTitle: "EXT. WOODEN SHACK - MORNING",
          sceneId: "13kMRibhC1MvrqrO5LNmP5RJScM",
          lineNum: 10,
          sceneCode: "A1",
          color: "#FFF",
          sceneOmitted: false,
          sceneLocked: false
        }
      ]
    },
    {
      t: "invalid format ",
      i: [
        {
          sceneTitle: "BRICK'S PATIO",
          sceneId: "14mRYX4fZ7iPGcRPfHArXzXlEE6",
          lineNum: 96,
          sceneCode: "B4",
          sceneOmitted: false,
          sceneLocked: false
        }
      ],
      o: [
        {
          sceneTitle: "BRICK'S PATIO",
          sceneId: "14mRYX4fZ7iPGcRPfHArXzXlEE6",
          lineNum: 96,
          sceneCode: "B4",
          color: "#FFF",
          sceneOmitted: false,
          sceneLocked: false
        }
      ]
    }
  ];
  testData.forEach(t => {
    it(`assignSceneColor ${t.t}`, () => {
      expect(assignSceneColor(t.i)).toEqual(t.o);
    });
  });
});
