/* eslint-disable import/no-default-export */
import { CurrencyDollarIcon, WarningCircleIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Combobox } from "@/components/ui/combobox";
import {
  Description,
  Field,
  HeadlessField,
  Label,
} from "@/components/ui/fieldset";
import { Option } from "@/components/ui/select";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Form/Combobox",
  component: Combobox,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  render: () => {
    return (
      <Combobox
        startEnhancer={<CurrencyDollarIcon />}
        name="color"
        placeholder="Select favorite color"
      >
        <Option>Red</Option>
        <Option>Blue</Option>
        <Option>Yellow</Option>
        <Option>Orange</Option>
      </Combobox>
    );
  },
  args: {
    children: null,
  },
};

export const WithLabel: Story = {
  render: () => {
    return (
      <Field>
        <Label>Favorite Color</Label>
        <Combobox name="user" placeholder="Select favorite color">
          <Option>Red</Option>
          <Option>Blue</Option>
          <Option>Yellow</Option>
          <Option>Orange</Option>
        </Combobox>
      </Field>
    );
  },
  args: {
    children: null,
  },
};

export const WithDescription: Story = {
  render: () => {
    return (
      <Field>
        <Label>Favorite Color</Label>
        <Combobox name="user" placeholder="Select favorite color">
          <Option>Red</Option>
          <Option>Blue</Option>
          <Option>Yellow</Option>
          <Option>Orange</Option>
        </Combobox>
        <Description>
          We will use this color for the logo on your profile.
        </Description>
      </Field>
    );
  },
  args: {
    children: null,
  },
};

export const WithOptionIcon: Story = {
  render: () => {
    return (
      <Field>
        <Label>Favorite Color</Label>
        <Combobox name="color" placeholder="Select favorite color">
          <Option textValue="Red">
            <WarningCircleIcon />
            <Label>Red</Label>
            <Description>The color red.</Description>
          </Option>
          <Option textValue="Yellow">
            <WarningCircleIcon />
            <Label>Yellow</Label>
            <Description>The color red.</Description>
          </Option>
          <Option>
            <WarningCircleIcon />
            <Label>Blue</Label>
            <Description>The color red.</Description>
          </Option>
          <Option>
            <WarningCircleIcon />
            <Label>Green</Label>
            <Description>The color red.</Description>
          </Option>
        </Combobox>
        <Description>
          We will use this color for the logo on your profile.
        </Description>
      </Field>
    );
  },
  args: {
    children: null,
  },
};

export const WithOptionDescription: Story = {
  render: () => {
    return (
      <Field>
        <Label>Favorite Color</Label>
        <Combobox name="color" placeholder="Select favorite color">
          <Option>
            <Label>Red</Label>
            <Description>The color red.</Description>
          </Option>
          <Option>
            <Label>Yellow</Label>
            <Description>The color red.</Description>
          </Option>
          <Option>
            <Label>Blue</Label>
            <Description>The color red.</Description>
          </Option>
          <Option>
            <Label>Green</Label>
            <Description>The color red.</Description>
          </Option>
        </Combobox>
        <Description>
          We will use this color for the logo on your profile.
        </Description>
      </Field>
    );
  },
  args: {
    children: null,
  },
};

export const Disabled: Story = {
  render: () => {
    return (
      <Field isDisabled>
        <Label>Favorite Color</Label>
        <Combobox name="user">
          <Option>Red</Option>
          <Option>Blue</Option>
          <Option>Yellow</Option>
          <Option>Orange</Option>
        </Combobox>
        <Description>
          We will use this color for the logo on your profile.
        </Description>
      </Field>
    );
  },
  args: {
    children: null,
  },
};

export const WithCustomLayout: Story = {
  render: () => {
    return (
      <HeadlessField className="flex grow items-baseline justify-center gap-6">
        <Label>Favorite Color</Label>
        <Combobox
          name="user"
          className="max-w-48"
          placeholder="Choose your color"
        >
          <Option>Red</Option>
          <Option>Blue</Option>
          <Option>Yellow</Option>
          <Option>Orange</Option>
        </Combobox>
      </HeadlessField>
    );
  },
  args: {
    children: null,
  },
};
