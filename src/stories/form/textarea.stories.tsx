/* eslint-disable import/no-default-export */
import { fn } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Description, HeadlessField, Label } from "@/components/ui/fieldset";
import { Textarea, TextareaField } from "@/components/ui/textarea";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Form/Textarea",
  component: TextareaField,
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
} satisfies Meta<typeof TextareaField>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    placeholder: "Enter Name",
  },
};

export const WithLabel: Story = {
  args: {
    label: "Username",
  },
};

export const WithDescription: Story = {
  args: {
    description: "This is a description",
  },
};

export const Disabled: Story = {
  args: {
    label: "Username",
    description: "This is a description",
    disabled: true,
  },
};

export const Readonly: Story = {
  args: {
    readOnly: true,
  },
};

export const WithCustomLayout: Story = {
  render: () => {
    return (
      <HeadlessField className="grid grid-cols-12 gap-6">
        <div className="col-span-5">
          <Label>Description</Label>
          <Description className="mt-1">
            This will be shown under the product title.
          </Description>
        </div>
        <div className="col-span-7">
          <Textarea name="description" rows={3} />
        </div>
      </HeadlessField>
    );
  },
  args: {
    readOnly: true,
  },
};
