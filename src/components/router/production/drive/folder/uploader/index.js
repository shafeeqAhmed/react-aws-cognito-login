// @flow
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Component from "./uploader";
import { getCurrentProduction } from "src/redux/modules/productions/selectors";
import { listActiveUploads } from "src/redux/modules/drive/selectors";
import { dismissUpload } from "src/redux/modules/drive";
import type { RootReducerState } from "src/redux/modules";
import type { Match, Route } from "src/helpers/router/route";
import type { Upload } from "src/redux/modules/drive";
import type { Production } from "src/redux/modules/productions";

type RouterProps = {
  +route: Route,
  +match: Match<{ productionId: string, folderId: ?string }>,
  +history: Object,
  +location: Location
};

type StateProps = {
  +production: ?Production,
  +uploads: Array<Upload>
};

type OwnProps = {};

type DispatchProps = {
  +dismissUpload: typeof dismissUpload
};

export type Props = RouterProps & OwnProps & StateProps & DispatchProps;

function mapStateToProps(state: RootReducerState, props: Props): Props {
  const production = getCurrentProduction(state);
  const uploads = listActiveUploads(state);

  return {
    production,
    uploads,
    ...props
  };
}

const mapDispatchToProps: DispatchProps = {
  dismissUpload
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Component)
);
