/* eslint-disable import/no-default-export */
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Checkbox,
  CheckboxField,
  CheckboxGroup,
} from "@/components/ui/checkbox";
import { HeadlessField, Label } from "@/components/ui/fieldset";
import { TextLink } from "@/components/ui/text";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Form/Checkbox",
  component: CheckboxField,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
} satisfies Meta<typeof CheckboxField>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Basic: Story = {
  args: {},
};

export const WithLabel: Story = {
  args: {
    label: "Accept the terms and conditions",
  },
};

export const WithDescription: Story = {
  args: {
    label: "Accept the terms and conditions",
    description: "You must accept the terms and conditions to continue.",
  },
};

export const Disabled: Story = {
  args: {
    label: "Accept the terms and conditions",
    description: "You must accept the terms and conditions to continue.",
    isDisabled: true,
  },
};

export const WithCustomLayout: Story = {
  render: () => {
    return (
      <HeadlessField className="flex items-center justify-between gap-4">
        <Label>Allow embedding</Label>
        <Checkbox name="allow_embedding" />
      </HeadlessField>
    );
  },
  args: {
    label: "Accept the terms and conditions",
    description: "You must accept the terms and conditions to continue.",
    isDisabled: true,
  },
};

export const CustomColor: Story = {
  args: {
    label: "Accept the terms and conditions",
    description: "You must accept the terms and conditions to continue.",
    color: "primary",
  },
};

export const DefaultCheckedState: Story = {
  args: {
    label: (
      <>
        Accept the <TextLink to=".">terms and conditions</TextLink>
      </>
    ),
    description: "You must accept the terms and conditions to continue.",
    defaultSelected: true,
  },
};

export const IndeterminateState: Story = {
  args: {
    label: "Accept the terms and conditions",
    description: "You must accept the terms and conditions to continue.",
    isIndeterminate: true,
  },
};

export const MultipleCheckboxes: Story = {
  render: () => {
    return (
      <CheckboxGroup>
        <CheckboxField
          name="forbid"
          value="forbid"
          label="Show on events page"
          description="Make this event visible on your profile."
        />
        <CheckboxField
          name="allow_embedding"
          value="allow_embedding"
          label="Allow embedding"
          description="Allow others to embed your event details on their own site."
        />
      </CheckboxGroup>
    );
  },
  args: {},
};
