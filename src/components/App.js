// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { type Node } from "react";
import Helmet from "react-helmet";
import Drawer from "@material-ui/core/Drawer";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Modal from "src/components/shared/Modal";
import LoadingIndicator from "src/components/shared/LoadingIndicator";
// import ErrorMessage from "src/components/shared/ErrorMessage";
import ProductionMenu from "src/components/layouts/productionMenu";
import Intercom from "src/components/shared/Intercom";
import blue from "@material-ui/core/colors/blue";
import vars from "config/variables";
import env from "config/env";
import css from "./App.style.css";
import type { ReduxProps } from "./";

type Props = ReduxProps & {
  children: Node,
  sidebarOpen: boolean
};

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  palette: {
    primary: blue,
    secondary: {
      main: "#4ece3d"
    },
    background: {
      default: "#f5f8fb",
      paper: "#ffffff"
    }
  }
});

export default class App extends React.PureComponent<Props> {
  componentDidMount() {
    const bindEvent = (element, eventName, eventHandler) => {
      if (element.addEventListener) {
        element.addEventListener(eventName, eventHandler, false);
      } else if (element.attachEvent) {
        element.attachEvent(`on${eventName}`, eventHandler);
      }
    };

    bindEvent(window, "message", e => {
      if (e.data && typeof e.data === "string") {
        try {
          const action = JSON.parse(e.data);

          if (action.type) {
            this.props.dispatch(action);
          }
        } catch (error) {
          // console.error(error, e);
        }
      }
    });
  }

  render() {
    const {
      appDescription,
      appIcon,
      appLogo,
      appTitle,
      appLogoWidth,
      appLogoHeight,
      colorTheme
    } = vars;

    const { ROOT_URL } = env;
    const { children, sidebarOpen, closeSidebar } = this.props;

    const drawer = (
      <Drawer
        anchor={"left"}
        open={sidebarOpen}
        elevation={0}
        classes={{
          paper: css.drawerPaper
        }}
        ModalProps={{
          onBackdropClick: () => {
            closeSidebar();
          }
        }}
        BackdropProps={{
          invisible: true
        }}
      >
        <button
          className={css.hiddenDismissButton}
          onClick={() => {
            closeSidebar();
          }}
        />
        <div className={css.drawerContent}>
          <ProductionMenu />
        </div>
      </Drawer>
    );

    return (
      <div id="application">
        <Helmet
          htmlAttributes={{ lang: "en" }}
          defaultTitle={appTitle}
          titleTemplate={`${appTitle} - %s`}
          meta={[
            { name: "theme-color", content: colorTheme },
            { name: "msapplication-TileColor", content: colorTheme },
            {
              name: "msapplication-TileImage",
              content: `${ROOT_URL}${appLogo}`
            },
            { property: "og:title", content: appTitle },
            { property: "og:image", content: `${ROOT_URL}${appLogo}` },
            { property: "og:image:width", content: appLogoWidth },
            { property: "og:image:height", content: appLogoHeight },
            { property: "og:url", content: ROOT_URL },
            { property: "og:description", content: appDescription },
            { name: "description", content: appDescription }
          ]}
          link={[
            { rel: "shortcut icon", href: appIcon },
            { rel: "apple-touch-icon", href: appIcon }
          ]}
        />
        <LoadingIndicator />

        {drawer}
        <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>

        <Modal />
        <Intercom />
      </div>
    );
  }
}
