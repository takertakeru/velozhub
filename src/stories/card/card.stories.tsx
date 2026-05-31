/* eslint-disable import/no-default-export */
import { CaretLineRightIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { Description, Label } from "@/components/ui/fieldset";
import { SurfaceActions, SurfaceInset } from "@/components/ui/surface";
import { MetricText, Text, Title } from "@/components/ui/text";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Surfaces/Card",
  component: Card,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

const metrics = [
  {
    name: "Monthly recurring revenue",
    value: "$34.1K",
    change: "+6.1%",
    changeType: "positive",
    href: "#",
  },
  {
    name: "Users",
    value: "500.1K",
    change: "+19.2%",
    changeType: "positive",
    href: "#",
  },
  {
    name: "User growth",
    value: "11.3%",
    change: "-1.2%",
    changeType: "negative",
    href: "#",
  },
];

export const Default: Story = {
  render: () => {
    return (
      <Card>
        <Title>Example card</Title>
        <Description>
          Proin ut dui sed metus pharetra hend rerit vel non mi. Nulla ornare
          faucibus ex, non facilisis nisl.
        </Description>
      </Card>
    );
  },
};

export const Bleed: Story = {
  args: { bleed: true },
  render: (args) => {
    return (
      <Card {...args}>
        <Title>Example card</Title>
        <Description>
          Proin ut dui sed metus pharetra hend rerit vel non mi. Nulla ornare
          faucibus ex, non facilisis nisl.
        </Description>
      </Card>
    );
  },
};

export const SectionBleed: Story = {
  render: (args) => {
    return (
      <Card {...args}>
        <SurfaceInset inset={["left", "right", "top"]}>
          <img
            className="object-fit h-full w-full"
            src="https://images.unsplash.com/photo-1617050318658-a9a3175e34cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
            alt=""
          />
        </SurfaceInset>
        <Title>Example card</Title>
        <Description>
          Proin ut dui sed metus pharetra hend rerit vel non mi. Nulla ornare
          faucibus ex, non facilisis nisl.
        </Description>
      </Card>
    );
  },
};

export const MetricCards: Story = {
  parameters: {
    layout: "padded",
  },
  render: () => {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((item) => {
          return (
            <Card key={item.name}>
              <div className="flex items-center justify-between">
                <Label color="unset" className="text-neutral-400">
                  {item.name}
                </Label>
                <Text color="success">{item.change}</Text>
              </div>
              <MetricText>{item.value}</MetricText>
              <Divider inset="context" />
              <SurfaceActions>
                <Button>
                  View More <CaretLineRightIcon />
                </Button>
              </SurfaceActions>
            </Card>
          );
        })}
      </div>
    );
  },
};
