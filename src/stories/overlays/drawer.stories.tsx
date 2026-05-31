/* eslint-disable import/no-default-export */
import { useState } from "react";
import { DialogTrigger } from "react-aria-components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Drawer } from "@/components/ui/drawer";
import { Description, FieldGroup, Label } from "@/components/ui/fieldset";
import { InputField } from "@/components/ui/input";
import { SurfaceActions } from "@/components/ui/surface";
import { Text, Title } from "@/components/ui/text";
import { Content, Footer, Header } from "@/components/ui/view";

const meta = {
  title: "Overlays/Drawer",
  component: Drawer,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data for stories
const mockProducts = [
  {
    id: "PRD-001",
    name: "MacBook Pro 14-inch",
    description:
      "Apple M3 Pro chip with 11-core CPU and 14-core GPU, 18GB memory",
    price: "$2,399.00",
    category: "Laptops",
    status: "In Stock",
  },
  {
    id: "PRD-002",
    name: "iPhone 15 Pro",
    description: "6.1-inch Super Retina XDR display with ProMotion technology",
    price: "$999.00",
    category: "Smartphones",
    status: "Low Stock",
  },
  {
    id: "PRD-003",
    name: "AirPods Pro (2nd gen)",
    description: "Active Noise Cancellation with Adaptive Transparency",
    price: "$249.00",
    category: "Audio",
    status: "In Stock",
  },
  {
    id: "PRD-004",
    name: "iPad Air 11-inch",
    description:
      "M2 chip delivers incredible performance for demanding workflows",
    price: "$599.00",
    category: "Tablets",
    status: "In Stock",
  },
  {
    id: "PRD-005",
    name: "Apple Watch Series 9",
    description: "GPS + Cellular, 45mm Midnight Aluminum Case with Sport Band",
    price: "$429.00",
    category: "Wearables",
    status: "In Stock",
  },
  {
    id: "PRD-006",
    name: "Magic Keyboard",
    description: "Wireless, rechargeable keyboard with numeric keypad",
    price: "$199.00",
    category: "Accessories",
    status: "In Stock",
  },
  {
    id: "PRD-007",
    name: "Studio Display",
    description: "27-inch 5K Retina display with nano-texture glass option",
    price: "$1,599.00",
    category: "Displays",
    status: "In Stock",
  },
  {
    id: "PRD-008",
    name: "Mac Studio",
    description: "M2 Ultra chip with 24-core CPU and 76-core GPU",
    price: "$4,999.00",
    category: "Desktops",
    status: "Out of Stock",
  },
  {
    id: "PRD-009",
    name: "Apple TV 4K",
    description: "A15 Bionic chip with 6-core CPU and 5-core GPU",
    price: "$179.00",
    category: "Entertainment",
    status: "In Stock",
  },
  {
    id: "PRD-010",
    name: "HomePod mini",
    description: "Smart speaker with room-filling 360-degree audio",
    price: "$99.00",
    category: "Smart Home",
    status: "In Stock",
  },
];

export const Default: Story = {
  args: { children: null },
  parameters: {
    docs: {
      description: {
        story: "This demonstrates the fundamental drawer pattern with the standard three-part structure: `Header`, `Content`, and `Footer`. The `DialogTrigger` component wraps both the trigger button and the drawer, managing the open/close state automatically. This refund payment workflow showcases the typical action-confirmation pattern with form input and clear call-to-action buttons in the footer."
      }
    }
  },
  render: () => {
    return (
      <DialogTrigger>
        <Button color="danger">Refund Payment</Button>
        <Drawer>
          <Header>
            <Title>Refund Payment</Title>
            <Description className="mt-2">
              The refund will be reflected in the customer&apos;s bank account
              2 to 3 business days after processing.
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
        </Drawer>
      </DialogTrigger>
    );
  },
};

// Different sizes showcase
export const Sizes: Story = {
  args: { children: null },
  parameters: {
    docs: {
      description: {
        story: "The Drawer component supports multiple sizes: `sm`, `md`, `lg`, and `xl`. Choose the appropriate size based on your content complexity. Small drawers work best for quick actions, while large drawers accommodate complex forms and detailed information."
      }
    }
  },
  render: () => {
    return (
      <div className="flex gap-4">
        <DialogTrigger>
          <Button variant="outline">Small Drawer</Button>
          <Drawer size="sm">
            <Header>
              <Title>Small Drawer</Title>
              <Description className="mt-2">
                Compact drawer for quick actions and simple forms.
              </Description>
            </Header>
            <Content>
              <Text>This is a small drawer with minimal content.</Text>
            </Content>
            <Footer className="mt-4">
              <SurfaceActions>
                <Button variant="plain" slot="close">
                  Close
                </Button>
                <Button>Confirm</Button>
              </SurfaceActions>
            </Footer>
          </Drawer>
        </DialogTrigger>

        <DialogTrigger>
          <Button variant="outline">Large Drawer</Button>
          <Drawer size="lg">
            <Header>
              <Title>Large Drawer</Title>
              <Description className="mt-2">
                Spacious drawer for complex forms and detailed content.
              </Description>
            </Header>
            <Content>
              <form>
                <FieldGroup>
                  <InputField
                    label="Full Name"
                    placeholder="Enter your name"
                  />
                  <InputField label="Email" placeholder="Enter your email" />
                  <InputField label="Phone" placeholder="Enter your phone" />
                </FieldGroup>
              </form>
            </Content>
            <Footer>
              <SurfaceActions>
                <Button variant="plain" slot="close">
                  Cancel
                </Button>
                <Button>Save Details</Button>
              </SurfaceActions>
            </Footer>
          </Drawer>
        </DialogTrigger>
      </div>
    );
  },
};

// Interactive state management
export const WithState: Story = {
  args: { children: null },
  parameters: {
    docs: {
      description: {
        story: "Drawers can manage complex interactive state including loading states, form validation, and conditional button states. This example demonstrates how to handle async operations with proper UI feedback using `useState` and controlled form inputs."
      }
    }
  },
  render: function StateExample() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [amount, setAmount] = useState("");

    const handleRefund = () => {
      setIsProcessing(true);
      // Simulate API call
      setTimeout(() => {
        setIsProcessing(false);
        setAmount("");
      }, 2000);
    };

    return (
      <DialogTrigger>
        <Button color="danger">Process Refund</Button>
        <Drawer>
          <Header>
            <Title>Process Refund</Title>
            <Description className="mt-2">
              Enter the refund amount. This action cannot be undone.
            </Description>
          </Header>
          <Content>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleRefund();
              }}
            >
              <FieldGroup>
                <InputField
                  label="Refund Amount"
                  placeholder="$0.00"
                  value={amount}
                  disabled={isProcessing}
                  onChange={(e) => {
                    setAmount(e.target.value);
                  }}
                />
              </FieldGroup>
            </form>
          </Content>
          <Footer className="mt-6">
            <SurfaceActions>
              <Button variant="plain" slot="close" isDisabled={isProcessing}>
                Cancel
              </Button>
              <Button
                color="danger"
                isDisabled={!amount || isProcessing}
                onPress={handleRefund}
              >
                {isProcessing ? "Processing..." : "Process Refund"}
              </Button>
            </SurfaceActions>
          </Footer>
        </Drawer>
      </DialogTrigger>
    );
  },
};

// Complex content with scrolling
export const ScrollableContent: Story = {
  args: { children: null },
  parameters: {
    docs: {
      description: {
        story: "When drawer content exceeds the available height, it automatically becomes scrollable. The header and footer remain fixed while the content area scrolls independently. This pattern works well for data tables, long lists, and detailed information displays."
      }
    }
  },
  render: () => {
    return (
      <DialogTrigger>
        <Button>View Product Catalog</Button>
        <Drawer size="lg">
          <Header>
            <Title>Product Catalog</Title>
            <Description className="mt-2">
              Browse through all available products. Content will scroll if it
              exceeds the drawer height.
            </Description>
          </Header>
          <Content className="flex-1 overflow-y-auto">
            <div className="space-y-4 overflow-y-auto p-px">
              {mockProducts.map((product) => {
                return (
                  <Card key={product.id}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="font-medium">{product.name}</Label>
                        <Text className="text-sm font-semibold">
                          {product.price}
                        </Text>
                      </div>
                      <Description className="text-sm">
                        {product.description}
                      </Description>
                      <div className="flex items-center justify-between text-xs">
                        <Text className="text-muted-foreground">
                          {product.category}
                        </Text>
                        <Badge content={product.status} />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </Content>
          <Footer className="mt-6">
            <SurfaceActions>
              <Button variant="plain" slot="close">
                Close
              </Button>
              <Button>Add Selected</Button>
            </SurfaceActions>
          </Footer>
        </Drawer>
      </DialogTrigger>
    );
  },
};

// Nested form example
export const FormExample: Story = {
  args: { children: null },
  parameters: {
    docs: {
      description: {
        story: "Drawers excel at housing complex forms with multiple sections. Use `FieldGroup` components to organize related fields and provide logical spacing. The large drawer size accommodates detailed forms while maintaining good UX on both desktop and mobile devices. Consider form validation and state management for production implementations."
      }
    }
  },
  render: () => {
    return (
      <DialogTrigger>
        <Button>Add User</Button>
        <Drawer>
          <Header>
            <Title>Add New User</Title>
            <Description className="mt-2">
              Fill out the form below to create a new user account.
            </Description>
          </Header>
          <Content>
            <form className="space-y-6">
              <FieldGroup>
                <InputField label="First Name" placeholder="John" />
                <InputField label="Last Name" placeholder="Doe" />
              </FieldGroup>

              <FieldGroup>
                <InputField
                  label="Email Address"
                  placeholder="john.doe@example.com"
                  type="email"
                />
                <InputField
                  label="Phone Number"
                  placeholder="+1 (555) 123-4567"
                  type="tel"
                />
              </FieldGroup>

              <FieldGroup>
                <InputField label="Department" placeholder="Engineering" />
                <InputField
                  label="Job Title"
                  placeholder="Software Engineer"
                />
              </FieldGroup>
            </form>
          </Content>
          <Footer className="mt-8">
            <SurfaceActions>
              <Button variant="plain" slot="close">
                Cancel
              </Button>
              <Button>Create User</Button>
            </SurfaceActions>
          </Footer>
        </Drawer>
      </DialogTrigger>
    );
  },
};
