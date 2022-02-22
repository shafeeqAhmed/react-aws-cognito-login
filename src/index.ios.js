// @flow
import React, { PureComponent } from "react";
import { Provider } from "react-redux";
import { NativeRouter } from "react-router-native";
import configureStore from "src/redux/store";

import renderRoutes from "src/helpers/router/renderRoutes";
import routes from "src/routes";

const store = configureStore();

class ReactTemplate extends PureComponent<void> {
  render() {
    return (
      <Provider store={store}>
        <NativeRouter>{renderRoutes(routes)}</NativeRouter>
      </Provider>
    );
  }
}

export default ReactTemplate;
