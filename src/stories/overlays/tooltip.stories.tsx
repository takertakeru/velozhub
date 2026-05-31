/* eslint-disable import/no-default-export */
import { TooltipTrigger } from "react-aria-components";
import { QuestionMarkIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/fieldset";
import { Paragraph } from "@/components/ui/text";
import { Tooltip } from "@/components/ui/tooltip";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Overlays/Tooltip",
  component: Tooltip,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: null },
  render: () => {
    return (
      <TooltipTrigger>
        <Button>
          <QuestionMarkIcon />
        </Button>
        <Tooltip>
          <Paragraph size="xs">This is a tooltip</Paragraph>
        </Tooltip>
      </TooltipTrigger>
    );
  },
};

export const WithDescription: Story = {
  args: { children: null },
  render: () => {
    return (
      <TooltipTrigger>
        <Button variant="plain">
          <QuestionMarkIcon />
        </Button>
        <Tooltip className="max-w-xs">
          <div>
            <Label className="font-medium" size="xs">
              This is a tooltip
            </Label>
            <Paragraph color="neutral" size="xs">
              Tooltips are used to describe or identify an element. In most
              scenarios, tooltip help the user understand meaning, function or
              alt-text.
            </Paragraph>
          </div>
        </Tooltip>
      </TooltipTrigger>
    );
  },
};
