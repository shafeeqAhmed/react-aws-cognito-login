// @flow
/* eslint-disable import/prefer-default-export */

export const Sections = {
  CREW: ("crew": "crew"),
  CAST: ("cast": "cast"),
  EXTRAS: ("extras": "extras"),
  NETWORK: ("network", "network")
};

export type Section = $Values<typeof Sections>;
