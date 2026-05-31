/* eslint-disable import/no-default-export */
import { fn } from "storybook/test";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/components/ui/button";
import { SearchField, SearchInput } from "@/components/ui/input";
import { Group } from "@/components/ui/utils";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Form/Search Input",
  component: SearchInput,
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
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    "aria-label": "Search",
    placeholder: "Enter Name",
  },
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
};

export const WithLabel: Story = {
  args: {},
  render: () => <SearchField label="Search for a user" />,
};

export const WithDescription: Story = {
  args: {},
  render: () => {
    return (
      <SearchField
        label="Search for a user"
        description="Search will only return users with the same first name"
      />
    );
  },
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const WithinAForm: Story = {
  render: () => {
    return (
      <form>
        <Group adjoined className="group inline-flex items-center">
          <SearchInput
            adjoined="right"
            placeholder="Search for a user"
            aria-label="Search"
          />
          <Button aria-label="Search User" adjoined="left" className="w-16">
            <MagnifyingGlassIcon />
          </Button>
        </Group>
      </form>
    );
  },
};
