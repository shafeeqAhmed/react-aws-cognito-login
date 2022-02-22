// @flow
import React, { PureComponent } from "react";
import css from "./extras.style.css";
import Layout from "src/components/layouts/directory";
import TopSection from "../components/top-section/top-section";
import Table from "./table";
import type { Props } from "./";

type State = {};

export default class Extras extends PureComponent<Props, State> {
  render() {
    return (
      <Layout>
        <TopSection sectionName={"Extras"} />
        <div className={css.directoryContent}>
          <Table />
        </div>
      </Layout>
    );
  }
}
