/* eslint-disable import/no-default-export */
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toaster, ToastRegion } from "@/components/ui/toast";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Overlays/Toast",
  component: ToastRegion,
  decorators: (Story) => {
    return (
      <Card className="aspect-video min-w-5xl items-center justify-center">
        <ToastRegion />
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
} satisfies Meta<typeof ToastRegion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <Button onPress={() => toaster("Message", { duration: Infinity })}>
        Toast
      </Button>
    );
  },
};
