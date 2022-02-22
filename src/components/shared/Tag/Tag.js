/* eslint-disable import/no-extraneous-dependencies */
// @flow
import React from "react";
import Chip from "@material-ui/core/Chip";
import { type Tag, TagTypes, type TagType } from "src/redux/modules/tags";

type Props = {
  tag: Tag,
  tagType?: TagType,
  isDisabled?: boolean
};

const TagChip = ({ tag, tagType, isDisabled, ...chipProps }: Props) => (
  <Chip
    key={tag.id || tag.name}
    color="primary"
    variant={tagType === TagTypes.TAG ? "default" : "outlined"}
    style={{
      pointerEvents: isDisabled ? "none" : undefined,
      backgroundColor: "#26c1c9",
      borderRadius: "2px"
    }}
    label={tag.name}
    {...chipProps}
  />
);

TagChip.defaultProps = {
  tagType: TagTypes.TAG,
  isDisabled: false
};

export default TagChip;
