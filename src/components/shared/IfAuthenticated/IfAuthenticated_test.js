// @flow

// Enzyme docs:
// http://airbnb.io/enzyme/docs/api/index.html

import React from "react";
import { shallow } from "enzyme";
import { CognitoStates } from "src/redux/modules/auth";
import IfAuthenticated from "./IfAuthenticated";

it("renders children if user is authenticated", () => {
  const wrapper = shallow(
    <IfAuthenticated cognitoState={CognitoStates.signedIn}>
      <button>Logout</button>
    </IfAuthenticated>
  );

  expect(wrapper.find("button").text()).toEqual("Logout");
});

it("renders nothing if user is unauthenticated", () => {
  const wrapper = shallow(
    <IfAuthenticated cognitoState={CognitoStates.signIn}>
      <button>Logout</button>
    </IfAuthenticated>
  );

  expect(wrapper.getElement()).toEqual(null);
});

it("renders nothing if there are no children", () => {
  const wrapper = shallow(
    <IfAuthenticated cognitoState={CognitoStates.signedIn} />
  );

  expect(wrapper.getElement()).toEqual(null);
});
