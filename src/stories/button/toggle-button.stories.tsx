/* eslint-disable import/no-default-export */
import { fn } from "storybook/test";
import { CrossIcon, MapPinIcon, UserCheckIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToggleButton, ToggleButtonGroup } from "@/components/ui/toggle-button";
import { Group } from "@/components/ui/utils";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Buttons/ToggleButton",
  component: ToggleButton,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
} satisfies Meta<typeof ToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Solid: Story = {
  args: {
    children: "Click Me",
    variant: "solid",
  },
};

export const Outline: Story = {
  args: {
    children: "Click Me",
    variant: "outline",
  },
};

export const Plain: Story = {
  args: {
    children: "Click Me",
    variant: "plain",
  },
};

export const Disabled: Story = {
  args: {
    children: "Click Me",
    isDisabled: true,
  },
};

export const ButtonGrouped: Story = {
  args: {
    children: null,
  },
  render: () => {
    return (
      <Group className="grid gap-4">
        <ToggleButtonGroup selectionMode="single" className="flex gap-2">
          <ToggleButton>Left</ToggleButton>
          <ToggleButton>Center</ToggleButton>
          <ToggleButton>Right</ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup selectionMode="single">
          <ToggleButton adjoined="right">Left</ToggleButton>
          <ToggleButton adjoined={["left", "right"]}>Center</ToggleButton>
          <ToggleButton adjoined="left">Right</ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup className="grid justify-center">
          <ToggleButton adjoined="bottom">
            <MapPinIcon />
          </ToggleButton>
          <ToggleButton adjoined={["top", "bottom"]}>
            <UserCheckIcon />
          </ToggleButton>
          <ToggleButton adjoined="top">
            <CrossIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Group>
    );
  },
};
