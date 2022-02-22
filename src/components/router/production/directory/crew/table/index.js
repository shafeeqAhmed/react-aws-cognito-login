// @flow
import { connect } from "react-redux";
import Component from "./table";
import type { RootReducerState } from "src/redux/modules";

const list = [
  {
    id: 1,
    collection: 0,
    nro: 1,
    role: "Executive Producer",
    name: "Andrew Smith",
    status: "Invited",
    days: 32,
    avatar:
      "https://www.thefix.com/sites/default/files/styles/article/public/brad-pitt-fix.jpg",
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
    nro: 2,
    avatar:
      "https://www.thefix.com/sites/default/files/styles/article/public/brad-pitt-fix.jpg",
    role: "Producer",
    name: "Bruce Ruiz",
    status: "Working",
    days: 42,
    productionTags: [
      {
        id: 1,
        name: "2nd Unit",
        color: "#faca00"
      },
      {
        id: 3,
        name: "Contractor",
        color: "#26c1c9"
      }
    ]
  },
  {
    id: 3,
    collection: 1,
    nro: 2,
    avatar:
      "https://www.thefix.com/sites/default/files/styles/article/public/brad-pitt-fix.jpg",
    role: "Producer",
    name: "Bruce Ruiz",
    status: "Working",
    days: 42,
    productionTags: [
      {
        id: 1,
        name: "2nd Unit",
        color: "#faca00"
      },
      {
        id: 3,
        name: "Contractor",
        color: "#26c1c9"
      }
    ]
  },
  {
    id: 43,
    collection: 1,
    nro: 2,
    avatar:
      "https://www.thefix.com/sites/default/files/styles/article/public/brad-pitt-fix.jpg",
    role: "Producer",
    name: "Bruce Ruiz",
    status: "Working",
    days: 42,
    productionTags: [
      {
        id: 1,
        name: "2nd Unit",
        color: "#faca00"
      },
      {
        id: 3,
        name: "Contractor",
        color: "#26c1c9"
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
  "0": "Production",
  "1": "Direction"
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
