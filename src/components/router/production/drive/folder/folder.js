// @flow
import React, { PureComponent } from "react";
import { get } from "lodash";
import css from "./folder.style.css";
import Layout from "src/components/layouts/drive";
import Breadcrumb from "./breadcrumb";
import Table from "./table";
import Uploader from "./uploader";
import { Sections } from "src/redux/modules/drive";
import type { Props } from "./";

type State = {
  +layout: "table"
};

export default class Folder extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { layout: "table" };
  }

  componentDidMount() {
    const productionId = get(this.props, "match.params.productionId");
    if (!productionId) return;
    const folderId = get(this.props, "match.params.folderId", "");
    this.getFiles(parseInt(productionId, 10), folderId);
  }

  componentWillReceiveProps(nextProps: Props, nextContent: any) {
    if (this.props.match.params !== nextProps.match.params) {
      const nextProductionId = get(nextProps, "match.params.productionId");
      const prevProductionId = get(this.props, "match.params.productionId");
      if (!nextProductionId) return;

      const nextFolderId = get(nextProps, "match.params.folderId");
      const prevFolderId = get(this.props, "match.params.folderId");

      if (
        prevProductionId !== nextProductionId ||
        prevFolderId !== nextFolderId
      )
        this.getFiles(parseInt(nextProductionId, 10), nextFolderId);
    }
  }

  getFiles = (productionId: number, folderId: ?string) => {
    switch (folderId) {
      case Sections.FAVORITES:
        this.props.fetchFavorites(productionId);
        break;
      case Sections.RECENT:
        this.props.fetchRecent(productionId);
        break;
      case Sections.TRASH:
        this.props.fetchDeleted(productionId);
        break;
      default:
        if (folderId) this.props.fetchFilePath(productionId, folderId);
        this.props.fetchFolderContent(productionId, folderId);
    }
  };

  render() {
    const { layout } = this.state;
    const { files } = this.props;

    return (
      <Layout>
        <div className={css.folderContent}>
          <Breadcrumb />
          {layout === "table" && <Table files={files} />}
          <Uploader />
        </div>
      </Layout>
    );
  }
}
