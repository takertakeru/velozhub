/* eslint-disable import/no-default-export */
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Description,
  Field,
  HeadlessField,
  Label,
} from "@/components/ui/fieldset";
import { MultiSelect, MultiSelectField } from "@/components/ui/multiple-select";
import { Option } from "@/components/ui/picker";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Form/Multi Select",
  component: MultiSelect,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
} satisfies Meta<typeof MultiSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Basic: Story = {
  args: {
    children: (item) => <Option textValue={item.label}>{item.label}</Option>,
    items: [
      { id: "active", label: "Active" },
      { id: "inactive", label: "Inactive" },
      { id: "delayed", label: "Delayed" },
    ],
  },
};

export const WithLabel: Story = {
  args: {
    children: null,
  },
  render: () => {
    return (
      <Field>
        <Label>Status</Label>
        <MultiSelect
          items={[
            { id: "active", label: "Active" },
            { id: "inactive", label: "Inactive" },
            { id: "delayed", label: "Delayed" },
          ]}
        >
          {(option) => <Option textValue={option.label}>{option.label}</Option>}
        </MultiSelect>
      </Field>
    );
  },
};

export const WithDescription: Story = {
  render: () => {
    return (
      <MultiSelectField
        label="Status"
        description="This will be visible to clients on the project."
      >
        <Option textValue="active">
          <Label>Active</Label>
          <Description>
            This will be visible to clients on the project.
          </Description>
        </Option>
        <Option textValue="paused">
          <Label>Paused</Label>
          <Description>
            This will be visible to clients on the project.
          </Description>
        </Option>
        <Option textValue="delayed">
          <Label>Delayed</Label>
          <Description>
            This will be visible to clients on the project.
          </Description>
        </Option>
        <Option textValue="canceled">
          <Label>Canceled</Label>
          <Description>
            This will be visible to clients on the project.
          </Description>
        </Option>
      </MultiSelectField>
    );
  },
  args: {
    children: null,
  },
};

export const Disabled: Story = {
  render: () => {
    return (
      <MultiSelectField
        isDisabled
        label="Status"
        description="This will be visible to clients on the project."
      >
        <Option textValue="active">Active</Option>
        <Option textValue="paused">Paused</Option>
        <Option textValue="delayed">Delayed</Option>
        <Option textValue="canceled">Canceled</Option>
      </MultiSelectField>
    );
  },
  args: {
    children: null,
  },
};

export const Invalid: Story = {
  args: {
    children: null,
  },
  render: () => {
    return (
      <Field isInvalid>
        <Label className="shrink-0">Full name</Label>
        <MultiSelect>
          <Option textValue="active">Active</Option>
          <Option textValue="paused">Paused</Option>
          <Option textValue="delayed">Delayed</Option>
          <Option textValue="canceled">Canceled</Option>
        </MultiSelect>
      </Field>
    );
  },
};

export const WithCustomLayout: Story = {
  render: () => {
    return (
      <HeadlessField className="flex items-baseline justify-center gap-6">
        <Label>Status</Label>
        <MultiSelect name="status">
          <Option textValue="active">Active</Option>
          <Option textValue="paused">Paused</Option>
          <Option textValue="delayed">Delayed</Option>
          <Option textValue="canceled">Canceled</Option>
        </MultiSelect>
      </HeadlessField>
    );
  },
  args: {
    children: null,
  },
};
