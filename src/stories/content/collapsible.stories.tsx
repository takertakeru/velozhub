/* eslint-disable import/no-default-export */
import { Collection } from "react-aria-components";
import { CaretRightIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Description } from "@/components/ui/fieldset";
import { Paragraph } from "@/components/ui/text";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Content/Collapsible",
  component: Accordion,
  decorators: (Story) => {
    return (
      <Card className="w-xl items-start justify-center">
        <Story />
      </Card>
    );
  },
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  {
    id: 1,
    q: "How do I reset my password?",
    a: "You can reset your password by going to the settings page and clicking on 'Reset Password'.",
  },
  {
    id: 2,
    q: "Can I change my subscription plan?",
    a: "Yes, you can upgrade or downgrade your subscription plan at any time from your account settings.",
  },
  {
    id: 3,
    q: "Where can I view my past orders?",
    a: "Your past orders can be viewed in the 'Orders' section of your account dashboard.",
  },
  {
    id: 4,
    q: "What is the return policy?",
    a: "Our return policy allows you to return products within 30 days of purchase for a full refund or exchange.",
  },
  {
    id: 5,
    q: "How do I contact customer support?",
    a: "You can contact customer support via email at support@example.com or through our online chat system.",
  },
];

export const Default: Story = {
  render: () => {
    return (
      <div className="w-lg">
        <Collapsible>
          <CollapsibleTrigger>System Requirements</CollapsibleTrigger>
          <CollapsiblePanel>
            <Paragraph>
              Regular exercise can improve your overall health, boost your mood,
              increase energy levels, and help you maintain a healthy weight.
            </Paragraph>
          </CollapsiblePanel>
        </Collapsible>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    return (
      <div className="w-lg">
        <Collapsible isDisabled>
          <CollapsibleTrigger>System Requirements</CollapsibleTrigger>
          <CollapsiblePanel>
            <Paragraph>
              Regular exercise can improve your overall health, boost your mood,
              increase energy levels, and help you maintain a healthy weight.
            </Paragraph>
          </CollapsiblePanel>
        </Collapsible>
      </div>
    );
  },
};

export const Grouped: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "When you need to group and control multiple collapsible sections together, use the `Accordion` component. This allows you to manage expanded state across multiple collapsibles, such as setting default expanded items or controlling exclusive expansion behavior.",
      },
    },
  },
  render: () => {
    return (
      <Accordion className="w-full">
        <Collection items={items}>
          {(item) => {
            return (
              <Collapsible>
                <CollapsibleTrigger>{item.q}</CollapsibleTrigger>
                <CollapsiblePanel>
                  <Paragraph>{item.a}</Paragraph>
                </CollapsiblePanel>
              </Collapsible>
            );
          }}
        </Collection>
      </Accordion>
    );
  },
};

export const DefaultExpanded: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use `defaultExpandedKeys` to specify which collapsible sections should be expanded by default when the accordion loads. Pass an array of item IDs (in this example, `[4]` expands the fourth item). This is useful for highlighting important content or providing context without requiring user interaction.",
      },
    },
  },
  render: () => {
    return (
      <Accordion defaultExpandedKeys={[4]}>
        <Collection items={items}>
          {(item) => {
            return (
              <Collapsible>
                <CollapsibleTrigger>{item.q}</CollapsibleTrigger>
                <CollapsiblePanel>
                  <Paragraph>{item.a}</Paragraph>
                </CollapsiblePanel>
              </Collapsible>
            );
          }}
        </Collection>
      </Accordion>
    );
  },
};

export const Divided: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "To add visual separation between collapsible sections, use Tailwind CSS utility classes like `divide-y divide-surface-border` on the `Accordion` container. This approach maintains consistency with our design system by leveraging semantic color tokens and spacing utilities. Always prefer Tailwind utilities over custom CSS for styling to ensure design system compliance.",
      },
    },
  },
  render: () => {
    return (
      <Accordion
        defaultExpandedKeys={[4]}
        className="divide-surface-border divide-y"
      >
        <Collection items={items}>
          {(item) => {
            return (
              <Collapsible>
                <CollapsibleTrigger>{item.q}</CollapsibleTrigger>
                <CollapsiblePanel>
                  <Paragraph>{item.a}</Paragraph>
                </CollapsiblePanel>
              </Collapsible>
            );
          }}
        </Collection>
      </Accordion>
    );
  },
};

const nestedItems = [
  {
    id: 1,
    title: "Clothing Categories",
    description: "Explore our wide range of clothing options for every season.",
    children: [
      {
        id: 101,
        title: "Men's Wear",
        description: "Stylish and comfortable outfits for men.",
      },
      {
        id: 102,
        title: "Women's Wear",
        description: "Elegant and trendy fashion for women.",
      },
      {
        id: 103,
        title: "Kids' Wear",
        description: "Colorful and playful clothing for kids.",
      },
    ],
  },
  {
    id: 2,
    title: "Electronics",
    description: "Discover the latest in technology and gadgets.",
    children: [
      {
        id: 201,
        title: "Smartphones",
        description: "Top brands and the latest models.",
      },
      {
        id: 202,
        title: "Laptops",
        description: "High-performance laptops for work and play.",
      },
      {
        id: 203,
        title: "Accessories",
        description: "Chargers, cases, and other must-have gadgets.",
      },
    ],
  },
  {
    id: 3,
    title: "Home & Living",
    description: "Everything you need to make your house a home.",
    children: [
      {
        id: 301,
        title: "Furniture",
        description: "Comfortable and stylish furniture for every room.",
      },
      {
        id: 302,
        title: "Decor",
        description: "Beautiful decor items to personalize your space.",
      },
      {
        id: 303,
        title: "Kitchen Essentials",
        description: "Practical and modern kitchen tools.",
      },
    ],
  },
];

export const Nested: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`Collapsible` components can be nested to create hierarchical content structures. Use `CollapsiblePanel` to contain nested sections. This example uses the `Collection` primitive from React Aria Components for optimal performance and data management. While you can map over items directly with `items.map()`, the `Collection` pattern is preferred as it automatically caches rendering results and avoids re-rendering all items when only one changes, providing better performance with large datasets.",
      },
    },
  },
  render: () => {
    return (
      <Accordion
        defaultExpandedKeys={[4]}
        className="divide-surface-border w-full divide-y"
      >
        <Collection items={nestedItems}>
          {(item) => {
            return (
              <Collapsible>
                <CollapsibleTrigger>{item.title}</CollapsibleTrigger>
                <CollapsiblePanel>
                  <Accordion className="">
                    <Collection items={item.children}>
                      {(nestedItem) => {
                        return (
                          <Collapsible>
                            <CollapsibleTrigger className="[--indicator-display:none]">
                              <CaretRightIcon className="" />
                              {nestedItem.title}
                            </CollapsibleTrigger>
                            <CollapsiblePanel>
                              <Description>
                                {nestedItem.description}
                              </Description>
                            </CollapsiblePanel>
                          </Collapsible>
                        );
                      }}
                    </Collection>
                  </Accordion>
                </CollapsiblePanel>
              </Collapsible>
            );
          }}
        </Collection>
      </Accordion>
    );
  },
};
