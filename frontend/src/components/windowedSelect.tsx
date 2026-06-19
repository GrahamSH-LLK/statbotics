import React from "react";
import WindowedSelect, { createFilter } from "react-windowed-select";
import type { GroupBase, Props as SelectProps } from "react-select";

type WindowedSelectProps<
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
> = SelectProps<Option, IsMulti, Group> & {
  windowThreshold?: number;
};

const TypedWindowedSelect = WindowedSelect as unknown as <
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(
  props: WindowedSelectProps<Option, IsMulti, Group>,
) => React.ReactElement;

export { createFilter };
export default TypedWindowedSelect;
