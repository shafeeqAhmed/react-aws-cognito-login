// @flow
import { get, mock } from "src/helpers/api";
import env from "config/env";

const { MOCK_WALKIE_API, WALKIE_API_URL } = env;

export const productionTypes = {
  data: [
    {
      id: 10,
      name: "Web",
      sequence: 0
    },
    {
      id: 1,
      name: "Feature",
      sequence: 1
    },
    {
      id: 2,
      name: "Short",
      sequence: 2
    },
    {
      id: 3,
      name: "Series",
      sequence: 3
    },
    {
      id: 4,
      name: "Stage",
      sequence: 4
    },
    {
      id: 5,
      name: "Broadcast",
      sequence: 5
    },
    {
      id: 6,
      name: "Event",
      sequence: 6
    },
    {
      id: 7,
      name: "Concert",
      sequence: 7
    },
    {
      id: 8,
      name: "Game",
      sequence: 8
    },
    {
      id: 9,
      name: "Software",
      sequence: 9
    },
    {
      id: 11,
      name: "Application",
      sequence: 11
    },
    {
      id: 12,
      name: "Office",
      sequence: 12
    },
    {
      id: 13,
      name: "Other",
      sequence: 13
    }
  ]
};

export default () =>
  MOCK_WALKIE_API
    ? mock(productionTypes, 500)
    : get(`${WALKIE_API_URL}/directory/productions/production_types`);
