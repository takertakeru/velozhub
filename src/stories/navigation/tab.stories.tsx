/* eslint-disable import/no-default-export */
import { Collection } from "react-aria-components";
import {
  ArrowUpIcon,
  ChartBarIcon,
  HouseIcon,
  UserIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "@/components/ui/card";
import { Description, Label } from "@/components/ui/fieldset";
import { Tab, TabList, TabPanel, Tabs } from "@/components/ui/tabs";
import {
  Code,
  MetricText,
  Paragraph,
  Strong,
  Title,
} from "@/components/ui/text";
import { EnhancerGroup } from "@/components/ui/utils";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Navigation/Tabs",
  component: Tabs,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const samplItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    items: [
      "Total Revenue: $24,500",
      "New Orders: 45",
      "Active Users: 1,234",
      "Conversion Rate: 3.2%",
    ],
  },
  {
    id: "analytics",
    label: "Analytics",
    items: [
      "Page Views: 15,678",
      "Unique Visitors: 8,456",
      "Bounce Rate: 35%",
      "Avg. Session Duration: 2m 45s",
    ],
  },
  {
    id: "users",
    label: "Users",
    items: [
      "John Doe - Admin",
      "Jane Smith - Editor",
      "Mike Johnson - Viewer",
      "Sarah Wilson - Editor",
    ],
  },
];

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Tabs provide a way to organize content into separate panels, allowing users to navigate between different sections easily. The `Tab` component extends `Button`, inheriting all button props and styling capabilities. The `TabPanel` component extends the `Surface` primitive, providing consistent spacing, background colors, and layout options including the `bleed` prop for full-width content. Use `Tabs`, `TabList`, `Tab`, and `TabPanel` components to create accessible tabbed interfaces. Each tab must have a corresponding panel with matching `id` attributes.",
      },
    },
  },
  render: () => {
    return (
      <div className="flex justify-center">
        <Tabs aria-label="Recipe App" className="w-full max-w-md">
          <TabList>
            <Tab id="r">Recipes</Tab>
            <Tab id="i">Ingredients</Tab>
            <Tab id="m">Meal Plans</Tab>
          </TabList>
          <TabPanel id="r">
            <Title>Recipe</Title>
            <Description>
              Browse through a wide selection of recipes for all occasions and
              dietary preferences.
            </Description>
          </TabPanel>
          <TabPanel id="i">
            <Title>Ingredients</Title>
            <Description>
              Check the list of ingredients needed for your chosen recipes.
            </Description>
          </TabPanel>
          <TabPanel id="m">
            <div>
              <Title className="font-medium">Meal Plans</Title>
              <Description>
                Discover curated meal plans to simplify your weekly cooking.
              </Description>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    );
  },
};

export const Dynamic: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use React Aria's `Collection` component to render tabs dynamically from data arrays. This pattern is ideal when tab content comes from API responses or needs to be generated programmatically. The `items` prop on `TabList` enables automatic key generation and efficient rendering.",
      },
    },
  },
  render: () => {
    return (
      <div className="flex justify-center">
        <Tabs aria-label="Admin Panel" className="w-full max-w-2xl">
          <TabList items={samplItems}>
            {(category) => {
              return (
                <Tab key={category.id} id={category.id}>
                  {category.label}
                </Tab>
              );
            }}
          </TabList>
          <Collection items={samplItems}>
            {(category) => {
              return (
                <TabPanel key={category.id} id={category.id}>
                  <Title className="mb-4">{category.label}</Title>
                  <ul className="space-y-2">
                    {category.items.map((item) => {
                      return (
                        <li key={item} className="text-surface-foreground/70">
                          {item}
                        </li>
                      );
                    })}
                  </ul>
                </TabPanel>
              );
            }}
          </Collection>
        </Tabs>
      </div>
    );
  },
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Individual tabs can be disabled using the `isDisabled` prop, which is inherited from the `Button` component. Since `Tab` extends `Button Styles`, it supports all button states and accessibility features. This is useful for restricting access to certain sections based on user permissions, loading states, or application logic. Disabled tabs are visually muted and cannot be selected via keyboard or mouse interaction.",
      },
    },
  },
  render: () => {
    return (
      <div className="flex justify-center">
        <Tabs aria-label="Project Settings" className="w-full max-w-md">
          <TabList>
            <Tab id="general">General</Tab>
            <Tab id="security">Security</Tab>
            <Tab isDisabled id="billing">
              Billing
            </Tab>
          </TabList>
          <TabPanel id="general">
            <Title>General Settings</Title>
            <Description>
              Configure basic project settings and preferences.
            </Description>
          </TabPanel>
          <TabPanel id="security">
            <Title>Security Settings</Title>
            <Description>
              Manage access controls and security policies.
            </Description>
          </TabPanel>
          <TabPanel id="billing">
            <Title>Billing Settings</Title>
            <Description>
              Manage subscription and payment information.
            </Description>
          </TabPanel>
        </Tabs>
      </div>
    );
  },
};

export const DefaultSelectedKey: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use the `defaultSelectedKey` prop to specify which tab should be active when the component first renders. This is useful for directing user attention to specific content or maintaining state across navigation. The value must match the `id` of the desired tab.",
      },
    },
  },
  render: () => {
    return (
      <div className="flex justify-center">
        <Tabs
          aria-label="Dashboard Sections"
          defaultSelectedKey="analytics"
          className="w-full max-w-md"
        >
          <TabList>
            <Tab id="overview">Overview</Tab>
            <Tab id="analytics">Analytics</Tab>
            <Tab id="reports">Reports</Tab>
          </TabList>
          <TabPanel id="overview">
            <Title>Overview</Title>
            <Description>
              Get a high-level view of your dashboard metrics.
            </Description>
          </TabPanel>
          <TabPanel id="analytics">
            <Title>Analytics</Title>
            <Description>
              <Strong>This tab is pre-selected</Strong> to highlight the most
              important content. Dive deep into your data and insights.
            </Description>
          </TabPanel>
          <TabPanel id="reports">
            <Title>Reports</Title>
            <Description>
              Generate and view detailed reports for your data.
            </Description>
          </TabPanel>
        </Tabs>
      </div>
    );
  },
};

export const Orientation: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Set `orientation="vertical"` to create a vertical tab layout. This orientation works well for sidebar navigation, settings panels, or when you have many tabs that would overflow horizontally. The tab list appears on the left with content panels to the right.',
      },
    },
  },
  render: () => {
    return (
      <div className="flex justify-center">
        <Tabs
          aria-label="User Profile"
          orientation="vertical"
          className="w-full max-w-2xl"
        >
          <TabList className="border-surface-border min-w-48 flex-col !border-r !border-b-0">
            <Tab id="profile" className="w-full justify-start">
              Profile
            </Tab>
            <Tab id="account" className="w-full justify-start">
              Account
            </Tab>
            <Tab id="privacy" className="w-full justify-start">
              Privacy
            </Tab>
          </TabList>
          <div className="flex-1 pl-6">
            <TabPanel id="profile">
              <Title>Profile Information</Title>
              <Description>
                Update your personal information and profile settings.
              </Description>
            </TabPanel>
            <TabPanel id="account">
              <Title>Account Settings</Title>
              <Description>
                Manage your account preferences and login information.
              </Description>
            </TabPanel>
            <TabPanel id="privacy">
              <Title>Privacy Controls</Title>
              <Description>
                Control your privacy settings and data sharing preferences.
              </Description>
            </TabPanel>
          </div>
        </Tabs>
      </div>
    );
  },
};

export const WithIcons: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Enhance tab navigation by adding icons from Phosphor Icons library. Since `Tab` extends `Button`, you can use all button styling patterns including icons, gaps, and custom layouts. Icons provide visual context and help users quickly identify different sections. Combine icons with text labels for optimal accessibility and user experience. Icons should be meaningful and consistent across your interface.",
      },
    },
  },
  render: () => {
    return (
      <div className="flex justify-center">
        <Tabs aria-label="Main Navigation" className="w-full max-w-lg">
          <TabList>
            <Tab id="dashboard" className="gap-2">
              <HouseIcon />
              Dashboard
            </Tab>
            <Tab id="analytics" className="gap-2">
              <ChartBarIcon />
              Analytics
            </Tab>
            <Tab id="users" className="gap-2">
              <UserIcon />
              Users
            </Tab>
          </TabList>
          <TabPanel id="dashboard">
            <div className="mb-2 flex items-center gap-2">
              <HouseIcon size={20} />
              <Title>Dashboard</Title>
            </div>
            <Description>
              Your main hub for monitoring key metrics and system status.
            </Description>
          </TabPanel>
          <TabPanel id="analytics">
            <div className="mb-2 flex items-center gap-2">
              <ChartBarIcon size={20} />
              <Title>Analytics</Title>
            </div>
            <Description>
              Comprehensive data analysis and reporting tools for insights.
            </Description>
          </TabPanel>
          <TabPanel id="users">
            <div className="mb-2 flex items-center gap-2">
              <UserIcon size={20} />
              <Title>User Management</Title>
            </div>
            <Description>
              Manage user accounts, permissions, and access controls.
            </Description>
          </TabPanel>
        </Tabs>
      </div>
    );
  },
};

export const NestedContent: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Tab panels can contain complex nested content including forms, tables, nested navigation, and interactive elements. This example demonstrates how tabs can organize sophisticated interfaces while maintaining clean separation of concerns and logical content grouping.",
      },
    },
  },
  render: () => {
    return (
      <div className="flex justify-center">
        <Tabs aria-label="Project Management" className="w-full max-w-4xl">
          <TabList>
            <Tab id="tasks">Tasks</Tab>
            <Tab id="team">Team</Tab>
            <Tab id="timeline">Timeline</Tab>
          </TabList>
          <TabPanel id="tasks">
            <Title>Task Management</Title>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <Description>
                  Track project progress and assignments
                </Description>
                <Strong className="text-sm">24 active tasks</Strong>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="bg-surface-muted rounded-lg p-4">
                  <Strong>To Do</Strong>
                  <div className="mt-2 space-y-2">
                    <div className="text-sm">Design wireframes</div>
                    <div className="text-sm">Setup development env</div>
                    <div className="text-sm">Create user personas</div>
                  </div>
                </div>
                <div className="bg-surface-muted rounded-lg p-4">
                  <Strong>In Progress</Strong>
                  <div className="mt-2 space-y-2">
                    <div className="text-sm">API integration</div>
                    <div className="text-sm">UI component library</div>
                  </div>
                </div>
                <div className="bg-surface-muted rounded-lg p-4">
                  <Strong>Completed</Strong>
                  <div className="mt-2 space-y-2">
                    <div className="text-sm">Project kickoff</div>
                    <div className="text-sm">Requirements gathering</div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel id="team">
            <Title>Team Members</Title>
            <div className="mt-4 space-y-4">
              <Description>Manage team access and responsibilities</Description>
              <div className="space-y-3">
                {[
                  {
                    name: "Sarah Johnson",
                    role: "Project Manager",
                    status: "Active",
                  },
                  {
                    name: "Mike Chen",
                    role: "Lead Developer",
                    status: "Active",
                  },
                  {
                    name: "Emily Davis",
                    role: "UI/UX Designer",
                    status: "Away",
                  },
                  {
                    name: "James Wilson",
                    role: "QA Engineer",
                    status: "Active",
                  },
                ].map((member) => {
                  return (
                    <div
                      key={member.name}
                      className="bg-surface-muted flex items-center justify-between rounded p-3"
                    >
                      <div>
                        <Strong className="text-sm">{member.name}</Strong>
                        <div className="text-surface-foreground/70 text-sm">
                          {member.role}
                        </div>
                      </div>
                      <span
                        className={`rounded px-2 py-1 text-xs ${
                          member.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {member.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabPanel>
          <TabPanel id="timeline">
            <Title>Project Timeline</Title>
            <div className="mt-4">
              <Description>Track milestones and deliverables</Description>
              <div className="mt-4 space-y-4">
                {[
                  {
                    date: "Week 1",
                    task: "Project Planning",
                    completed: true,
                  },
                  { date: "Week 2-3", task: "Design Phase", completed: true },
                  {
                    date: "Week 4-6",
                    task: "Development Sprint 1",
                    completed: false,
                  },
                  {
                    date: "Week 7-8",
                    task: "Testing & QA",
                    completed: false,
                  },
                  { date: "Week 9", task: "Deployment", completed: false },
                ].map((milestone) => {
                  return (
                    <div
                      key={`${milestone.date}-${milestone.task}`}
                      className="bg-surface-muted flex items-center gap-4 rounded p-3"
                    >
                      <div
                        className={`h-3 w-3 rounded-full ${
                          milestone.completed
                            ? "bg-green-500"
                            : "bg-surface-border"
                        }`}
                      />
                      <div className="flex-1">
                        <Strong className="text-sm">{milestone.task}</Strong>
                        <div className="text-surface-foreground/70 text-sm">
                          {milestone.date}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    );
  },
};

export const SurfaceInheritance: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`TabPanel` extends the `Surface` primitive, inheriting all surface styling capabilities including consistent spacing, background colors, and layout options. Use the `bleed` prop to create full-width content that extends to the edges of the container, perfect for media, tables, or other content that needs to break out of the default surface padding.",
      },
    },
  },
  render: () => {
    return (
      <div className="flex justify-center">
        <Tabs aria-label="Surface Demo" className="w-full max-w-2xl">
          <TabList>
            <Tab id="standard">Standard Panel</Tab>
            <Tab id="bleed">Bleed Panel</Tab>
            <Tab id="custom">Custom Surface</Tab>
          </TabList>
          <TabPanel id="standard">
            <div>
              <Title>Standard Surface Spacing</Title>
              <Description>
                This panel uses default Surface spacing and padding. Content is
                properly inset from the edges, following our design
                system&rsquo;s spacing principles.
              </Description>
            </div>
            <Card>
              <Title>Example Content</Title>
              <Description>
                This content block demonstrates the standard surface layout with
                consistent padding and spacing throughout the interface.
              </Description>
            </Card>
          </TabPanel>
          <TabPanel id="bleed">
            <div className="">
              <Title>Full-Width Bleed Content</Title>
              <Description className="text-blue-100">
                This panel uses{" "}
                <Code className="bg-white/20 text-white">bleed=true</Code> to
                extend content to the container edges. Perfect for hero
                sections, full-width images, or content that needs maximum
                visual impact.
              </Description>
            </div>
            <div className="p-6">
              <Strong>Regular Content Below</Strong>
              <div className="mt-2 text-sm">
                You can mix bleed and regular content within the same panel by
                applying padding to specific sections as needed.
              </div>
            </div>
          </TabPanel>
          <TabPanel bleed id="custom">
            <div>
              <Title>Custom Surface Styling</Title>
              <Description>
                Since TabPanel extends Surface, you can apply custom styling
                including background gradients, borders, and other surface
                treatments while maintaining consistent spacing behavior.
              </Description>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-white/60 p-4 dark:bg-black/20">
                <Strong>Surface Feature 1</Strong>
                <div className="mt-2 text-sm">
                  Custom surface styling maintains accessibility and
                  readability.
                </div>
              </div>
              <div className="rounded-lg bg-white/60 p-4 dark:bg-black/20">
                <Strong>Surface Feature 2</Strong>
                <div className="mt-2 text-sm">
                  Consistent spacing is preserved across all variants.
                </div>
              </div>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    );
  },
};

export const NavigationTabs: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use tabs for primary navigation between major application sections. This pattern works well for single-page applications or when you want to provide quick switching between related views without full page reloads. Consider using `TabLink` component for URL-based navigation with TanStack Router integration.",
      },
    },
  },
  render: () => {
    return (
      <div className="flex justify-center">
        <Tabs aria-label="Application Navigation" className="w-full max-w-4xl">
          <TabList>
            <Tab id="home" className="gap-2">
              <HouseIcon />
              Home
            </Tab>
            <Tab id="products">Products</Tab>
            <Tab id="customers">Customers</Tab>
          </TabList>
          <TabPanel id="home">
            <Title>Welcome to Your Dashboard</Title>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Card>
                <Label>Total Sales</Label>
                <MetricText>$12,345</MetricText>
                <EnhancerGroup>
                  <ArrowUpIcon
                    weight="bold"
                    className="text-brand-accent leading-[1lh]"
                  />
                  <Paragraph>12% from last month</Paragraph>
                </EnhancerGroup>
              </Card>
              <Card>
                <Label>New Customers</Label>
                <MetricText>156</MetricText>
                <EnhancerGroup>
                  <ArrowUpIcon
                    weight="bold"
                    className="text-brand-accent leading-[1lh]"
                  />
                  <Paragraph size="xs">8% from last month</Paragraph>
                </EnhancerGroup>
              </Card>
              <Card>
                <Label>Active Orders</Label>
                <MetricText>89</MetricText>
                <Description>No change</Description>
              </Card>
            </div>
          </TabPanel>
          <TabPanel id="products">
            <div className="p-6">
              <Title className="mb-4 text-2xl">Product Catalog</Title>
              <Description className="mb-4">
                Manage your product inventory, pricing, and categories.
              </Description>
              <div className="bg-surface-muted rounded-lg p-4">
                <Strong>Recently Added Products</Strong>
                <div className="mt-2 space-y-1">
                  <div>Wireless Headphones - $129.99</div>
                  <div>Smart Watch - $299.99</div>
                  <div>USB-C Cable - $19.99</div>
                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel id="customers">
            <div className="p-6">
              <Title className="mb-4 text-2xl">Customer Management</Title>
              <Description className="mb-4">
                View customer profiles, order history, and support tickets.
              </Description>
              <div className="bg-surface-muted rounded-lg p-4">
                <Strong>Recent Customer Activity</Strong>
                <div className="mt-2 space-y-1">
                  <div>John Doe placed order #1234</div>
                  <div>Jane Smith updated profile</div>
                  <div>Mike Johnson submitted support ticket</div>
                </div>
              </div>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    );
  },
};
