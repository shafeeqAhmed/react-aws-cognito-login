// @flow
import React, { PureComponent } from "react";
import css from "./cast.style.css";
import Layout from "src/components/layouts/directory";
import TopSection from "../components/top-section/top-section";
import Table from "./table";
import type { Props } from "./";

type State = {};

export default class Cast extends PureComponent<Props, State> {
  render() {
    return (
      <Layout>
        <TopSection sectionName={"Cast"} />
        <div className={css.directoryContent}>
          <Table />
        </div>
      </Layout>
    );
  }
}
