// @flow
const serializer = require("jest-serializer-path");
const config = require("./browser");

expect.addSnapshotSerializer(serializer);

it.skip("webpack config matches snapshot", () => {
  expect(config).toMatchSnapshot();
});
