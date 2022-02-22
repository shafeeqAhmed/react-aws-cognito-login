// @flow
import { connect } from "react-redux";
import Component from "./table";
import type { RootReducerState } from "src/redux/modules";

const list = [
  {
    id: 1,
    collection: 0,
    nro: 1,
    role: "Sherlock’s Entourage (25)",
    name: "Andrew Smith",
    status: "Invited",
    days: 32,
    people: [
      "https://www.thefix.com/sites/default/files/styles/article/public/brad-pitt-fix.jpg",
      "https://www.thefix.com/sites/default/files/styles/article/public/brad-pitt-fix.jpg",
      "https://www.thefix.com/sites/default/files/styles/article/public/brad-pitt-fix.jpg",
      "https://www.thefix.com/sites/default/files/styles/article/public/brad-pitt-fix.jpg"
    ],
    ages: "25-30",
    race: "Any",
    gender: "Male",
    otherScenes: [
      {
        number: 1,
        color: "#64a685"
      },
      {
        number: 2,
        color: "#cfe3f2"
      },
      {
        number: 3,
        color: "#fae190"
      },
      {
        number: 4,
        color: "#f37043"
      }
    ],
    productionTags: [
      {
        id: 1,
        name: "2nd Unit",
        color: "#faca00"
      },
      {
        id: 2,
        name: "ATL",
        color: "#81c926"
      }
    ]
  },
  {
    id: 2,
    collection: 1,
    nro: 1,
    role: "Sherlock’s Entourage (25)",
    name: "Andrew Smith",
    status: "Invited",
    days: 32,
    people: [
      "https://www.thefix.com/sites/default/files/styles/article/public/brad-pitt-fix.jpg",
      "https://www.thefix.com/sites/default/files/styles/article/public/brad-pitt-fix.jpg",
      "https://www.thefix.com/sites/default/files/styles/article/public/brad-pitt-fix.jpg",
      "https://www.thefix.com/sites/default/files/styles/article/public/brad-pitt-fix.jpg"
    ],
    ages: "25-30",
    race: "Any",
    gender: "Male",
    otherScenes: [
      {
        number: 1,
        color: "#64a685"
      },
      {
        number: 2,
        color: "#cfe3f2"
      },
      {
        number: 3,
        color: "#fae190"
      },
      {
        number: 4,
        color: "#f37043"
      }
    ],
    productionTags: [
      {
        id: 1,
        name: "2nd Unit",
        color: "#faca00"
      },
      {
        id: 2,
        name: "ATL",
        color: "#81c926"
      }
    ]
  }
];

const columns = [
  { dataKey: "nro", label: "No" },
  { dataKey: "role", label: "Role" },
  { dataKey: "name", label: "Name" },
  { dataKey: "status", label: "Status" },
  { dataKey: "days", label: "Days" },
  { dataKey: "productionTags", label: "Production Tags" }
];

const collections = {
  "0": "1 EXT. SHERLOCK’S FLAT - DAY   (12-19-2023)",
  "1": "2 EXT. SHERLOCK’S FLAT - Night   (12-20-2023)"
};

type OwnProps = {};

type StateProps = {
  +list: Array<Object>,
  +collections: Object,
  +columns: Array<Object>
};

function mapStateToProps(state: RootReducerState, props: OwnProps): StateProps {
  return {
    list,
    collections,
    columns,
    ...props
  };
}

/**
 * DispatchProps provide ways to mutate the state.
 */
type DispatchProps = {};

const mapDispatchToProps: DispatchProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
export type Props = OwnProps & StateProps & DispatchProps;
