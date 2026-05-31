/* eslint-disable import/no-default-export */
import { EnvelopeIcon, UsersIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field, HeadlessField, Label } from "@/components/ui/fieldset";
import { TagInput, TagInputField } from "@/components/ui/tag-input";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Form/Tag Input",
  component: TagInputField,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {},
} satisfies Meta<typeof TagInputField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Enter Name",
  },
};

export const WithLabel: Story = {
  args: {
    label: "Attached Emails",
  },
};

export const WithDescription: Story = {
  args: {
    description: "This is a description",
  },
};

export const Disabled: Story = {
  args: {
    label: "Attached Emails",
    description: "This is a description",
    disabled: true,
  },
};

export const Readonly: Story = {
  args: {
    readOnly: true,
    description:
      "This code is used to identify your account and is only shown once. ",
  },
};

export const Invalid: Story = {
  render: () => {
    return (
      <Field isInvalid>
        <Label className="shrink-0">Attached Emails</Label>
        <TagInput />
      </Field>
    );
  },
};

export const WithIcon: Story = {
  args: {
    label: "Enter Emails",
    startEnhancer: <UsersIcon />,
  },
};

export const WithStartEnhancer: Story = {
  args: {
    label: "Enter Emails",
    startEnhancer: <EnvelopeIcon />,
  },
};
export const WithEndEnhancer: Story = {
  args: {
    label: "Enter Emails",
    endEnhancer: <EnvelopeIcon />,
  },
};

export const WithCustomLayout: Story = {
  render: () => {
    return (
      <HeadlessField className="flex items-center justify-center gap-6">
        <Label className="shrink-0">Attached Emails</Label>
        <TagInput className="max-w-48" />
      </HeadlessField>
    );
  },
};
