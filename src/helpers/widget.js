// @flow

type Action = {
  type: string,
  payload: any
};

export const sendToWidget = (action: Action) => {
  const walkieWidget = document.getElementById("walkieWidget");
  if (walkieWidget) {
    walkieWidget.contentWindow.postMessage(JSON.stringify(action), "*");
  } else {
    const timer = setInterval(() => {
      const walkie = document.getElementById("walkieWidget");
      if (walkie) {
        walkie.contentWindow.postMessage(JSON.stringify(action), "*");
        clearInterval(timer);
      }
    }, 3000);
  }
};

export const loginWalkie = (token: string) => {
  const LOGIN_SCRIPT = "production-cliq-widget/auth/LOGIN_SCRIPT";
  const action = {
    type: LOGIN_SCRIPT,
    payload: token
  };

  sendToWidget(action);
};

export const toggleWidget = (show: ?boolean) => {
  const TOGGLE_CONTENT = "production-cliq-widget/ui/TOGGLE_CONTENT";
  const action = {
    type: TOGGLE_CONTENT,
    payload: show
  };

  sendToWidget(action);
};

export const sendProductionWidget = (productionId: number) => {
  const SAVE_PRODUCTION = "production-cliq-widget/production/SAVE_PRODUCTION";
  const action = {
    type: SAVE_PRODUCTION,
    payload: productionId
  };
  sendToWidget(action);
};

export default loginWalkie;
