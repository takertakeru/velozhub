/* eslint-disable import/no-default-export */
import { useState } from "react";
import { CheckIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, type Placement, placementOptions } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Description } from "@/components/ui/fieldset";
import { Title } from "@/components/ui/text";
import { Content, Header } from "@/components/ui/view";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Content/Badge",
  component: Badge,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  args: { children: null, content: "" },
  tags: ["autodocs"],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: null, content: "" },
  parameters: {
    docs: {
      description: {
        story:
          "Badges are small supplemental elements that highlight feature information or promotions within a user flow. Badge content should generally be 3 words or less. The main difference between badges and tags is that badges are informational only, while tags are actionable.",
      },
    },
  },
  render: () => {
    return (
      <Badge content="Important" color="danger">
        <Card>
          <Title>Badge Example</Title>
          <Description>
            This card demonstrates how badges overlay content to provide
            additional context or highlight important information.
          </Description>
        </Card>
      </Badge>
    );
  },
};

export const BadgePlacement: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Badges can be positioned in 8 different locations around their target element using the `placement` prop. Choose from `topLeft`, `top`, `topRight`, `bottomLeft`, `bottom`, `bottomRight`, `left`, or `right`. Click the buttons below to see how each placement affects the badge position.",
      },
    },
  },
  render: () => {
    const [activePlacement, setActivePlacement] =
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useState<Placement>("topRight");

    return (
      <Badge content="Available" placement={activePlacement}>
        <Card>
          <Header>
            <Title>Interactive Placement Demo</Title>
            <Description>
              Click the buttons below to change the badge placement
            </Description>
          </Header>
          <Content className="grid grid-cols-4 gap-2">
            {Object.keys(placementOptions).map((v) => {
              return (
                <Button
                  color="primary"
                  variant={v === activePlacement ? "solid" : "outline"}
                  key={v}
                  onPress={() => {
                    setActivePlacement(v as Placement);
                  }}
                >
                  {v}
                </Button>
              );
            })}
          </Content>
        </Card>
      </Badge>
    );
  },
};

export const HintDot: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`HintDot` is a subtle nudging badge that points out something new or important. It's typically used as a small dot indicator anchored to entry points, icons, or navigation elements to draw attention without being intrusive. When using `type='hintDot'`, the badge will always default to one placement only, regardless of the `placement` prop value.",
      },
    },
  },
  render: () => {
    return (
      <Badge content="Available" type="hintDot">
        <Card>
          <Title>New Feature Available</Title>
          <Description>
            This card demonstrates how hint dots subtly indicate new or updated
            content without overwhelming the user interface.
          </Description>
        </Card>
      </Badge>
    );
  },
};
export const NotificationCircle: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`NotificationCircle` badges are perfect for displaying counts, status indicators, or small icons. They automatically format numbers above 9 as '9+' to maintain visual consistency. Use them for notification counts, status indicators, or completion states.",
      },
    },
  },
  render: () => {
    return (
      <div className="gap-surface-gutter grid grid-cols-1 md:grid-cols-2">
        <Badge
          content={<CheckIcon className="size-2.5" />}
          type="notificationCircle"
          color="success"
          className="h-full"
        >
          <Card className="h-full">
            <Title>Task Completed</Title>
            <Description>
              This example shows a notification circle with an icon to indicate
              completion status.
            </Description>
          </Card>
        </Badge>
        <Badge content="3" type="notificationCircle" color="danger">
          <Card>
            <Title>Unread Messages</Title>
            <Description>
              This example shows a notification circle with a count to indicate
              the number of unread items.
            </Description>
          </Card>
        </Badge>
      </div>
    );
  },
};
