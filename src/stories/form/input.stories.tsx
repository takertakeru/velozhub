/* eslint-disable import/no-default-export */
import { fn } from "storybook/test";
import {
  CurrencyDollarIcon,
  SortAscendingIcon,
  UserIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import {
  Field,
  FieldGroup,
  Fieldset,
  HeadlessField,
  Label,
  Legend,
} from "@/components/ui/fieldset";
import { Input, InputField } from "@/components/ui/input";
import { Group } from "@/components/ui/utils";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Form/Input",
  component: InputField,
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
} satisfies Meta<typeof InputField>;

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
    "aria-label": "Example Input",
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
    value: "BaVrRKpRMS_ndKU",
    description:
      "This code is used to identify your account and is only shown once. ",
  },
};

export const Invalid: Story = {
  render: () => {
    return (
      <Field isInvalid>
        <Label className="shrink-0">Full name</Label>
        <Input />
      </Field>
    );
  },
};

export const Clearable: Story = {
  render: () => {
    return (
      <Field>
        <Label className="shrink-0">Full name</Label>
        <Input isClearable />
      </Field>
    );
  },
};

export const WithIcon: Story = {
  args: {
    label: "Enter Amount",
    startEnhancer: <CurrencyDollarIcon />,
  },
};

export const WithStartEnhancer: Story = {
  args: {
    label: "Price",
    startEnhancer: <CurrencyDollarIcon />,
  },
};

export const Adjoined: Story = {
  render: () => {
    return (
      <form>
        <FieldGroup>
          <Field>
            <Label>Search Candidates</Label>
            <Group adjoined data-slot="control" className="group flex">
              <Button adjoined="right">
                <SortAscendingIcon />
                Sort
              </Button>
              <Input adjoined="left" />
            </Group>
          </Field>
          <Field>
            <Label>Search Candidates</Label>
            <Group adjoined data-slot="control" className="group">
              <Input adjoined="bottom" placeholder="First Name" />
              <Divider inset="unset" />
              <Input adjoined="top" placeholder="Last Name" />
            </Group>
          </Field>
          <FieldGroup>
            <Fieldset>
              <Legend>Card details</Legend>
              <div className="mt-2">
                <Input
                  type="text"
                  placeholder="Card number"
                  aria-label="Card number"
                  adjoined="bottom"
                />
                <Divider inset="unset" />
                <div className="flex">
                  <Input
                    type="text"
                    placeholder="MM / YY"
                    aria-label="Expiration date"
                    adjoined={["top", "right"]}
                  />
                  <Divider inset="unset" orientation="vertical" />
                  <Input
                    type="text"
                    placeholder="CVC"
                    aria-label="CVC"
                    adjoined={["top", "left"]}
                  />
                </div>
              </div>
            </Fieldset>
          </FieldGroup>
          <Field>
            <Label>Search Candidates</Label>
            <Group adjoined data-slot="control" className="group flex">
              <Input adjoined="right" startEnhancer={<UserIcon />} />
              <Button adjoined="left">
                <SortAscendingIcon />
                Sort
              </Button>
            </Group>
          </Field>
        </FieldGroup>
      </form>
    );
  },
};

export const WithCustomLayout: Story = {
  render: () => {
    return (
      <HeadlessField className="flex items-center justify-center gap-6">
        <Label className="shrink-0">Full name</Label>
        <Input name="full_name" className="max-w-48" />
      </HeadlessField>
    );
  },
};
