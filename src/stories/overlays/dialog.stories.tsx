/* eslint-disable import/no-default-export */
import { DialogTrigger } from "react-aria-components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Description, FieldGroup } from "@/components/ui/fieldset";
import { InputField } from "@/components/ui/input";
import { SurfaceActions } from "@/components/ui/surface";
import { Title } from "@/components/ui/text";
import { Content, Footer, Header } from "@/components/ui/view";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Overlays/Dialog",
  component: Dialog,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  tags: ["autodocs"],
  args: { size: "lg" },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: null },
  render: () => {
    return (
      <DialogTrigger>
        <Button color="danger">Refund Payment</Button>
        <Dialog>
          <Header>
            <Title>Refund Payment</Title>
            <Description className="mt-2">
              The refund will be reflected in the customer’s bank account 2 to 3
              business days after processing.
            </Description>
          </Header>
          <Content>
            <form action="">
              <FieldGroup>
                <InputField label="Amount" placeholder="$0.00" />
              </FieldGroup>
            </form>
          </Content>
          <Footer className="mt-8">
            <SurfaceActions>
              <Button variant="plain" slot="close">
                Cancel
              </Button>
              <Button color="danger">Refund</Button>
            </SurfaceActions>
          </Footer>
        </Dialog>
      </DialogTrigger>
    );
  },
};

export const Size: Story = {
  args: { children: null },
  render: () => {
    return (
      <DialogTrigger>
        <Button color="danger">Refund Payment Larger</Button>
        <Dialog size="xl">
          <Header>
            <Title>Refund Payment</Title>
            <Description className="mt-2">
              The refund will be reflected in the customer’s bank account 2 to 3
              business days after processing.
            </Description>
          </Header>
          <Content>
            <form action="">
              <FieldGroup>
                <InputField label="Amount" placeholder="$0.00" />
              </FieldGroup>
            </form>
          </Content>
          <Footer className="mt-8">
            <SurfaceActions>
              <Button variant="plain" slot="close">
                Cancel
              </Button>
              <Button color="danger">Refund</Button>
            </SurfaceActions>
          </Footer>
        </Dialog>
      </DialogTrigger>
    );
  },
};
