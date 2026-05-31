/* eslint-disable import/no-default-export */
import { DialogTrigger } from "react-aria-components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import {
  Description,
  Field,
  Fieldset,
  Label,
  Legend,
} from "@/components/ui/fieldset";
import { Input } from "@/components/ui/input";
import {
  MetricText,
  Strong,
  Text,
  TextButton,
  Title,
} from "@/components/ui/text";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Content/Text",
  component: Text,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        This feature is only available to users on the{" "}
        <Strong>Business Plan</Strong>. To upgrade, visit your billing settings
      </>
    ),
  },
};

export const TextAsDescription: Story = {
  args: {
    children: null,
  },
  render: () => {
    return (
      <Fieldset>
        <Legend>Shipping details</Legend>
        <Description>
          Without this your odds of getting your order are low.
        </Description>
      </Fieldset>
    );
  },
};

export const Headings: Story = {
  args: {
    children: null,
  },
  render: () => {
    return (
      <div>
        <Title className="font-bold">Shipping details</Title>
        <Description>Overview</Description>
      </div>
    );
  },
};
export const TextAsLabel: Story = {
  args: {
    children: null,
  },
  render: () => {
    return (
      <div>
        <Label className="font-medium">Shipping details</Label>
        <Description>
          Without this your odds of getting your order are low.
        </Description>
      </div>
    );
  },
};

export const TextAsButton: Story = {
  args: {
    children: null,
  },
  render: () => {
    return (
      <div>
        <Field>
          <Label className="font-bold">Shipping details</Label>
          <Input />
          <Description>
            Without this your odds of getting your order are low.{" "}
            <DialogTrigger>
              <TextButton className="text-brand-primary-text font-medium hover:underline">
                Learn More
              </TextButton>
              <Dialog>
                <Title>Terms of Service</Title>
                <Description>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor
                </Description>
              </Dialog>
            </DialogTrigger>
          </Description>
        </Field>
      </div>
    );
  },
};

export const Metric: Story = {
  args: {
    children: null,
  },
  render: () => {
    return (
      <div className="grid grid-cols-3 gap-4">
        <Card className="w-2xs">
          <Label color="unset" className="text-neutral-400">
            Unique Visitors
          </Label>
          <div className="flex items-baseline gap-2">
            <MetricText>10,450</MetricText>
            <Text color="success">+12.5%</Text>
          </div>
        </Card>
        <Card className="w-2xs">
          <Label color="unset" className="text-neutral-400">
            Unique Visitors
          </Label>
          <div className="flex items-baseline gap-2">
            <MetricText>10,450</MetricText>
            <Text color="danger">-12.5%</Text>
          </div>
        </Card>
        <Card className="w-2xs">
          <Label color="unset" className="text-neutral-400">
            Unique Visitors
          </Label>
          <div className="flex items-baseline gap-2">
            <MetricText>10,450</MetricText>
            <Text color="success">+12.5%</Text>
          </div>
        </Card>
      </div>
    );
  },
};
