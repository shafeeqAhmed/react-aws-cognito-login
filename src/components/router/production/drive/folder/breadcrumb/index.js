// @flow
import { connect } from "react-redux";
import { get } from "lodash";
import { withRouter } from "react-router";
import Component from "./breadcrumb";
import { getCurrentProduction } from "src/redux/modules/productions/selectors";
import { getFile } from "src/redux/modules/drive/selectors";
import type { RootReducerState } from "src/redux/modules";
import type { Match, Route } from "src/helpers/router/route";
import type { File } from "src/redux/modules/drive";
import type { Production } from "src/redux/modules/productions";

type RouterProps = {
  +route: Route,
  +match: Match<{ productionId: string, folderId: ?string }>,
  +history: Object,
  +location: Location
};

type StateProps = {
  +production: ?Production,
  +folders: Array<File>
};

type OwnProps = {};

type DispatchProps = {};

export type Props = RouterProps & OwnProps & StateProps & DispatchProps;

function mapStateToProps(
  state: RootReducerState,
  props: OwnProps & RouterProps
): Props {
  const production = getCurrentProduction(state);

  let folders: Array<File> = [];
  let folderId = get(props, "match.params.folderId");

  while (folderId) {
    const folder = getFile(state, folderId);

    if (folder) {
      folders = [folder, ...folders];
    }

    folderId = folder ? folder.folderId : null;
  }

  return {
    production,
    folders,
    ...props
  };
}

const mapDispatchToProps: DispatchProps = {};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Component)
);
