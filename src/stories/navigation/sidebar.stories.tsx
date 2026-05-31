/* eslint-disable import/no-default-export */
import { useState } from "react";
import { Heading, MenuTrigger } from "react-aria-components";
import {
  CaretDownIcon,
  CaretUpIcon,
  DotsThreeIcon,
  EnvelopeIcon,
  GearIcon,
  GridFourIcon,
  HouseIcon,
  LifebuoyIcon,
  LightbulbIcon,
  MagnifyingGlassIcon,
  MegaphoneIcon,
  PlusIcon,
  QuestionIcon,
  ShieldCheckIcon,
  SignOutIcon,
  SparkleIcon,
  TicketIcon,
  UserIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsiblePanel } from "@/components/ui/collapsible";
import { Divider } from "@/components/ui/divider";
import { Label } from "@/components/ui/fieldset";
import { Link } from "@/components/ui/link";
import { Menu, MenuItem } from "@/components/ui/menu";
import {
  Sidebar,
  SidebarBody,
  SidebarDivider,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from "@/components/ui/sidebar";
import { Group } from "@/components/ui/utils";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "navigation/Sidebar",
  component: Sidebar,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "padded",
    docs: {
      description: {
        component: "A flexible sidebar component that supports headers, body sections, and footers. Can be composed with various navigation patterns including collapsible items, grouped sections, and user menus. Built on React Aria Components for full accessibility.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "A fully-featured sidebar with header, body, and footer sections. Includes team switching, search functionality, main navigation, and user profile menu. This represents the most comprehensive sidebar layout pattern with all available components.",
      },
    },
  },
  render: () => {
    return (
      <div className="-mx-6 flex min-w-[300px] items-start justify-center overflow-hidden border-y border-neutral-200 bg-white sm:mx-0 sm:max-w-full sm:rounded-lg sm:border dark:border-white/10 dark:bg-neutral-900">
          <div className="h-152 w-full">
            <Sidebar className="h-full w-64 border-r border-neutral-950/5 bg-zinc-100 dark:bg-neutral-950">
              <SidebarHeader>
                <MenuTrigger>
                  <SidebarItem className="mb-2.5">
                    <Avatar src="https://avatar.iran.liara.run/public" />
                    Tailwind Labs
                    <CaretDownIcon />
                  </SidebarItem>
                  <Menu className="min-w-64">
                    <MenuItem>
                      <GearIcon />
                      <Label>Settings</Label>
                    </MenuItem>
                    <Divider />
                    <MenuItem>
                      <Avatar
                        slot="icon"
                        src="https://avatar.iran.liara.run/public"
                      />
                      <Label>Tailwind Labs</Label>
                    </MenuItem>
                    <MenuItem>
                      <Avatar
                        slot="icon"
                        initials="WC"
                        className="bg-purple-500 text-white"
                      />
                      <Label>Workcation</Label>
                    </MenuItem>
                    <Divider />
                    <MenuItem>
                      <PlusIcon />
                      <Label>New team&hellip;</Label>
                    </MenuItem>
                  </Menu>
                </MenuTrigger>
                <SidebarSection>
                  <SidebarItem>
                    <MagnifyingGlassIcon />
                    <SidebarLabel>Search</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem>
                    <EnvelopeIcon />
                    <SidebarLabel>Inbox</SidebarLabel>
                  </SidebarItem>
                </SidebarSection>
              </SidebarHeader>
              <SidebarBody>
                <SidebarSection>
                  <SidebarItem href="/home">
                    <HouseIcon />
                    <SidebarLabel>Home</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem>
                    <GridFourIcon />
                    <SidebarLabel>Events</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem>
                    <TicketIcon />
                    <SidebarLabel>Orders</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem>
                    <MegaphoneIcon />
                    <SidebarLabel>Broadcasts</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem>
                    <GearIcon />
                    <SidebarLabel>Settings</SidebarLabel>
                  </SidebarItem>
                </SidebarSection>
                <SidebarSpacer />
                <SidebarDivider />
                <SidebarSection>
                  <SidebarHeading>Resources</SidebarHeading>
                  <SidebarItem>
                    <QuestionIcon />
                    <SidebarLabel>Support</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem>
                    <SparkleIcon />
                    <SidebarLabel>Changelog</SidebarLabel>
                  </SidebarItem>
                </SidebarSection>
              </SidebarBody>
              <SidebarFooter>
                <MenuTrigger>
                  <SidebarItem>
                    <span className="flex min-w-0 items-center gap-3">
                      <Avatar
                        shape="square"
                        src="https://avatar.iran.liara.run/public"
                        className="size-10"
                        alt=""
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
                          Erica
                        </span>
                        <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                          erica@example.com
                        </span>
                      </span>
                    </span>
                    <CaretUpIcon />
                  </SidebarItem>
                  <Menu className="min-w-64" placement="top start">
                    <MenuItem>
                      <UserIcon />
                      <Label>My profile</Label>
                    </MenuItem>
                    <MenuItem>
                      <GearIcon />
                      <Label>Settings</Label>
                    </MenuItem>
                    <Divider />
                    <MenuItem>
                      <ShieldCheckIcon />
                      <Label>Privacy policy</Label>
                    </MenuItem>
                    <MenuItem>
                      <LightbulbIcon />
                      <Label>Share feedback</Label>
                    </MenuItem>
                    <Divider />
                    <MenuItem href="/logout">
                      <SignOutIcon />
                      <Label>Sign out</Label>
                    </MenuItem>
                  </Menu>
                </MenuTrigger>
              </SidebarFooter>
            </Sidebar>
          </div>
      </div>
    );
  },
};

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story: "A minimal sidebar containing only the SidebarBody with navigation items. This is the simplest sidebar implementation, perfect for applications that need clean, straightforward navigation without additional header or footer content.",
      },
    },
  },
  render: () => {
    return (
      <div className="-mx-6 flex min-w-[300px] items-start justify-center overflow-hidden border-y border-neutral-200 bg-white sm:mx-0 sm:max-w-full sm:rounded-lg sm:border dark:border-white/10 dark:bg-neutral-900">
          <div className="h-152 w-full">
            <Sidebar className="h-full w-64 border-r border-neutral-950/5 bg-zinc-100 dark:bg-neutral-950">
              <SidebarBody>
                <SidebarSection>
                  <SidebarItem href="/home">
                    <HouseIcon />
                    <SidebarLabel>Home</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem>
                    <GridFourIcon />
                    <SidebarLabel>Events</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem>
                    <TicketIcon />
                    <SidebarLabel>Orders</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem>
                    <MegaphoneIcon />
                    <SidebarLabel>Broadcasts</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem>
                    <GearIcon />
                    <SidebarLabel>Settings</SidebarLabel>
                  </SidebarItem>
                </SidebarSection>
              </SidebarBody>
            </Sidebar>
          </div>
      </div>
    );
  },
};

export const WithLogo: Story = {
  parameters: {
    docs: {
      description: {
        story: "A basic sidebar enhanced with a brand logo at the top. The logo is placed within the SidebarBody and serves as a clickable home link. This pattern provides brand recognition while maintaining clean navigation structure.",
      },
    },
  },
  render: () => {
    return (
      <div className="-mx-6 flex min-w-[300px] items-start justify-center overflow-hidden border-y border-neutral-200 bg-white sm:mx-0 sm:max-w-full sm:rounded-lg sm:border dark:border-white/10 dark:bg-neutral-900">
          <div className="h-152 w-full">
            <Sidebar className="h-full w-64 border-r border-neutral-950/5 bg-zinc-100 dark:bg-neutral-950">
              <SidebarBody>
                <div className="mb-2 flex">
                  <Link to="." aria-label="Home" className="h-5">
                    <img
                      className="size-full invert"
                      alt="Ingenuity"
                      src="https://www.ingenuity.ph/wp-content/uploads/2024/02/ingenuity-logo-2020_-light.png"
                    />
                  </Link>
                </div>
                <SidebarSection>
                  <SidebarItem href="/home">
                    <HouseIcon />
                    <SidebarLabel>Home</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem>
                    <GridFourIcon />
                    <SidebarLabel>Events</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem>
                    <TicketIcon />
                    <SidebarLabel>Orders</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem>
                    <MegaphoneIcon />
                    <SidebarLabel>Broadcasts</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem>
                    <GearIcon />
                    <SidebarLabel>Settings</SidebarLabel>
                  </SidebarItem>
                </SidebarSection>
              </SidebarBody>
            </Sidebar>
          </div>
        </div>
    );
  },
};

export const ActiveState: Story = {
  parameters: {
    docs: {
      description: {
        story: "Demonstrates how sidebar items appear when they represent the current page or active state. Use the current prop on SidebarItem to indicate the user's current location in the application.",
      },
    },
  },
  render: () => {
    return (
      <div className="-mx-6 flex min-w-[300px] items-start justify-center overflow-hidden border-y border-neutral-200 bg-white sm:mx-0 sm:max-w-full sm:rounded-lg sm:border dark:border-white/10 dark:bg-neutral-900">
          <div className="h-152 w-full">
            <Sidebar className="h-full w-64 border-r border-neutral-950/5 bg-zinc-100 dark:bg-neutral-950">
              <SidebarBody>
                <div className="mb-2 flex">
                  <Link to="." aria-label="Home" className="h-5">
                    <img
                      className="size-full invert"
                      alt="Ingenuity"
                      src="https://www.ingenuity.ph/wp-content/uploads/2024/02/ingenuity-logo-2020_-light.png"
                    />
                  </Link>
                </div>
                <SidebarSection>
                  <SidebarItem current>
                    <HouseIcon />
                    <SidebarLabel>Home</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem>
                    <GridFourIcon />
                    <SidebarLabel>Events</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem>
                    <TicketIcon />
                    <SidebarLabel>Orders</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem>
                    <MegaphoneIcon />
                    <SidebarLabel>Broadcasts</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem>
                    <GearIcon />
                    <SidebarLabel>Settings</SidebarLabel>
                  </SidebarItem>
                </SidebarSection>
              </SidebarBody>
            </Sidebar>
          </div>
        </div>
    );
  },
};

export const StickyHeader: Story = {
  parameters: {
    docs: {
      description: {
        story: "A sidebar with a SidebarHeader containing team switching and quick actions, plus a scrollable body with navigation items. The header remains visible while the body content scrolls, perfect for long navigation lists.",
      },
    },
  },
  render: () => {
    return (
      <div className="-mx-6 flex min-w-[300px] items-start justify-center overflow-hidden border-y border-neutral-200 bg-white sm:mx-0 sm:max-w-full sm:rounded-lg sm:border dark:border-white/10 dark:bg-neutral-900">
          <div className="h-152 w-full">
            <Sidebar className="h-full w-64 border-r border-neutral-950/5 bg-zinc-100 dark:bg-neutral-950">
              <SidebarHeader>
                <MenuTrigger>
                  <SidebarItem className="mb-2.5">
                    <Avatar src="https://avatar.iran.liara.run/public" />
                    Tailwind Labs
                    <CaretDownIcon />
                  </SidebarItem>
                  <Menu className="min-w-64">
                    <MenuItem>
                      <GearIcon />
                      <Label>Settings</Label>
                    </MenuItem>
                    <Divider />
                    <MenuItem>
                      <Avatar
                        slot="icon"
                        src="https://avatar.iran.liara.run/public"
                      />
                      <Label>Tailwind Labs</Label>
                    </MenuItem>
                    <MenuItem>
                      <Avatar
                        slot="icon"
                        initials="WC"
                        className="bg-purple-500 text-white"
                      />
                      <Label>Workcation</Label>
                    </MenuItem>
                    <Divider />
                    <MenuItem>
                      <PlusIcon />
                      <Label>New team&hellip;</Label>
                    </MenuItem>
                  </Menu>
                </MenuTrigger>
                <SidebarSection>
                  <SidebarItem>
                    <MagnifyingGlassIcon />
                    <SidebarLabel>Search</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem>
                    <EnvelopeIcon />
                    <SidebarLabel>Inbox</SidebarLabel>
                  </SidebarItem>
                </SidebarSection>
              </SidebarHeader>
              <SidebarBody>
                <SidebarSection>
                  <SidebarItem current>
                    <HouseIcon />
                    <SidebarLabel>Home</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem>
                    <GridFourIcon />
                    <SidebarLabel>Events</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem>
                    <TicketIcon />
                    <SidebarLabel>Orders</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem>
                    <MegaphoneIcon />
                    <SidebarLabel>Broadcasts</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem>
                    <GearIcon />
                    <SidebarLabel>Settings</SidebarLabel>
                  </SidebarItem>
                </SidebarSection>
              </SidebarBody>
            </Sidebar>
          </div>
        </div>
    );
  },
};
export const StickyFooter: Story = {
  parameters: {
    docs: {
      description: {
        story: "A sidebar with both SidebarHeader and SidebarFooter sections. The footer contains non-navigation items like support links that remain accessible at the bottom while the body content scrolls. Perfect for persistent utility actions.",
      },
    },
  },
  render: () => {
    return (
      <div className="-mx-6 flex min-w-[300px] items-start justify-center overflow-hidden border-y border-neutral-200 bg-white sm:mx-0 sm:max-w-full sm:rounded-lg sm:border dark:border-white/10 dark:bg-neutral-900">
          <div className="h-152 w-full">
            <Sidebar className="h-full w-64 border-r border-neutral-950/5 bg-zinc-100 dark:bg-neutral-950">
              <SidebarHeader>
                <MenuTrigger>
                  <SidebarItem className="mb-2.5">
                    <Avatar src="https://avatar.iran.liara.run/public" />
                    Tailwind Labs
                    <CaretDownIcon />
                  </SidebarItem>
                  <Menu className="min-w-64">
                    <MenuItem>
                      <GearIcon />
                      <Label>Settings</Label>
                    </MenuItem>
                    <Divider />
                    <MenuItem>
                      <Avatar
                        slot="icon"
                        src="https://avatar.iran.liara.run/public"
                      />
                      <Label>Tailwind Labs</Label>
                    </MenuItem>
                    <MenuItem>
                      <Avatar
                        slot="icon"
                        initials="WC"
                        className="bg-purple-500 text-white"
                      />
                      <Label>Workcation</Label>
                    </MenuItem>
                    <Divider />
                    <MenuItem>
                      <PlusIcon />
                      <Label>New team&hellip;</Label>
                    </MenuItem>
                  </Menu>
                </MenuTrigger>
                <SidebarSection>
                  <SidebarItem>
                    <MagnifyingGlassIcon />
                    <SidebarLabel>Search</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem>
                    <EnvelopeIcon />
                    <SidebarLabel>Inbox</SidebarLabel>
                  </SidebarItem>
                </SidebarSection>
              </SidebarHeader>
              <SidebarBody>
                <SidebarSection>
                  <SidebarItem current>
                    <HouseIcon />
                    <SidebarLabel>Home</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem>
                    <GridFourIcon />
                    <SidebarLabel>Events</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem>
                    <TicketIcon />
                    <SidebarLabel>Orders</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem>
                    <MegaphoneIcon />
                    <SidebarLabel>Broadcasts</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem>
                    <GearIcon />
                    <SidebarLabel>Settings</SidebarLabel>
                  </SidebarItem>
                </SidebarSection>
              </SidebarBody>
              <SidebarFooter>
                <SidebarItem>
                  <LifebuoyIcon />
                  <SidebarLabel>Support</SidebarLabel>
                </SidebarItem>
                <SidebarItem>
                  <SparkleIcon />
                  <SidebarLabel>Changelog</SidebarLabel>
                </SidebarItem>
              </SidebarFooter>
            </Sidebar>
          </div>
        </div>
    );
  },
};

export const CollapsibleItems: Story = {
  parameters: {
    docs: {
      description: {
        story: "Advanced sidebar featuring collapsible navigation sections with context menus. Uses Group and Heading to structure complex triggers that combine expandable navigation with additional actions. The CollapsiblePanel applies bleed and gapless to remove default spacing, then uses px-5 to properly indent sub-items within the sidebar's visual hierarchy. Ideal for hierarchical navigation requiring per-section actions.",
      },
    },
  },
  render: () => {
    return (
      <div className="-mx-6 flex min-w-[300px] items-start justify-center overflow-hidden border-y border-neutral-200 bg-white sm:mx-0 sm:max-w-full sm:rounded-lg sm:border dark:border-white/10 dark:bg-neutral-900">
          <div className="h-152 w-full">
            <Sidebar className="h-full w-64 border-r border-neutral-950/5 bg-zinc-100 dark:bg-neutral-950">
              <SidebarHeader>
                <MenuTrigger>
                  <SidebarItem className="mb-2.5">
                    <Avatar src="https://avatar.iran.liara.run/public" />
                    Tailwind Labs
                    <CaretDownIcon />
                  </SidebarItem>
                  <Menu className="min-w-64">
                    <MenuItem>
                      <GearIcon />
                      <Label>Settings</Label>
                    </MenuItem>
                    <Divider />
                    <MenuItem>
                      <Avatar
                        slot="icon"
                        src="https://avatar.iran.liara.run/public"
                      />
                      <Label>Tailwind Labs</Label>
                    </MenuItem>
                    <MenuItem>
                      <Avatar
                        slot="icon"
                        initials="WC"
                        className="bg-purple-500 text-white"
                      />
                      <Label>Workcation</Label>
                    </MenuItem>
                    <Divider />
                    <MenuItem>
                      <PlusIcon />
                      <Label>New team&hellip;</Label>
                    </MenuItem>
                  </Menu>
                </MenuTrigger>
                <SidebarSection>
                  <SidebarItem>
                    <MagnifyingGlassIcon />
                    <SidebarLabel>Search</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem>
                    <EnvelopeIcon />
                    <SidebarLabel>Inbox</SidebarLabel>
                  </SidebarItem>
                </SidebarSection>
              </SidebarHeader>
              <SidebarBody>
                <SidebarSection>
                  <Collapsible defaultExpanded>
                    <Group className="flex items-center">
                      <Heading className="flex-1">
                        <SidebarItem current slot="trigger">
                          <HouseIcon />
                          <SidebarLabel>Home</SidebarLabel>
                          <CaretDownIcon />
                        </SidebarItem>
                      </Heading>
                      <MenuTrigger>
                        <Button
                          variant="plain"
                          inset={["top", "bottom", "right"]}
                        >
                          <DotsThreeIcon />
                        </Button>
                        <Menu placement="right top">
                          <MenuItem>Installation</MenuItem>
                        </Menu>
                      </MenuTrigger>
                    </Group>
                    <CollapsiblePanel bleed gapless className="px-5">
                      <SidebarItem>
                        <GridFourIcon />
                        <SidebarLabel>Routing</SidebarLabel>
                      </SidebarItem>
                      <SidebarItem>
                        <GridFourIcon />
                        <SidebarLabel>Rendering</SidebarLabel>
                      </SidebarItem>
                      <SidebarItem>
                        <GridFourIcon />
                        <SidebarLabel>Caching</SidebarLabel>
                      </SidebarItem>
                    </CollapsiblePanel>
                  </Collapsible>
                  <SidebarItem>
                    <GridFourIcon />
                    <SidebarLabel>Events</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem>
                    <TicketIcon />
                    <SidebarLabel>Orders</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem>
                    <MegaphoneIcon />
                    <SidebarLabel>Broadcasts</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem>
                    <GearIcon />
                    <SidebarLabel>Settings</SidebarLabel>
                  </SidebarItem>
                </SidebarSection>
              </SidebarBody>
            </Sidebar>
          </div>
        </div>
    );
  },
};

export const GroupedNavigation: Story = {
  parameters: {
    docs: {
      description: {
        story: "Demonstrates organizing navigation items into logical sections using multiple SidebarSection components with SidebarHeading labels. This pattern helps categorize navigation items, making it easier for users to find related functionality. Essential for applications with many navigation options.",
      },
    },
  },
  render: () => {
    return (
      <div className="-mx-6 flex min-w-[300px] items-start justify-center overflow-hidden border-y border-neutral-200 bg-white sm:mx-0 sm:max-w-full sm:rounded-lg sm:border dark:border-white/10 dark:bg-neutral-900">
          <div className="h-152 w-full">
            <Sidebar className="h-full w-64 border-r border-neutral-950/5 bg-zinc-100 dark:bg-neutral-950">
              <SidebarBody>
                <div className="mb-2 flex">
                  <Link to="." aria-label="Home" className="h-5">
                    <img
                      className="size-full invert"
                      alt="Ingenuity"
                      src="https://www.ingenuity.ph/wp-content/uploads/2024/02/ingenuity-logo-2020_-light.png"
                    />
                  </Link>
                </div>
                <SidebarSection>
                  <SidebarHeading>Dashboard</SidebarHeading>
                  <SidebarItem current>
                    <HouseIcon />
                    <SidebarLabel>Overview</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem>
                    <GridFourIcon />
                    <SidebarLabel>Analytics</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem>
                    <MagnifyingGlassIcon />
                    <SidebarLabel>Reports</SidebarLabel>
                  </SidebarItem>
                </SidebarSection>
                <SidebarSection>
                  <SidebarHeading>Management</SidebarHeading>
                  <SidebarItem>
                    <TicketIcon />
                    <SidebarLabel>Orders</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem>
                    <UserIcon />
                    <SidebarLabel>Customers</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem>
                    <MegaphoneIcon />
                    <SidebarLabel>Marketing</SidebarLabel>
                  </SidebarItem>
                </SidebarSection>
                <SidebarSpacer />
                <SidebarSection>
                  <SidebarHeading>Tools</SidebarHeading>
                  <SidebarItem>
                    <GearIcon />
                    <SidebarLabel>Settings</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem>
                    <QuestionIcon />
                    <SidebarLabel>Help</SidebarLabel>
                  </SidebarItem>
                </SidebarSection>
              </SidebarBody>
            </Sidebar>
          </div>
        </div>
    );
  },
};

export const IconOnly: Story = {
  parameters: {
    docs: {
      description: {
        story: "A compact sidebar displaying only icons without labels, perfect for space-constrained layouts or secondary navigation. Uses proper aria-label attributes for accessibility and tooltip support through the title attribute. Ideal for applications where screen real estate is premium.",
      },
    },
  },
  render: () => {
    return (
      <div className="-mx-6 flex min-w-[300px] items-start justify-center overflow-hidden border-y border-neutral-200 bg-white sm:mx-0 sm:max-w-full sm:rounded-lg sm:border dark:border-white/10 dark:bg-neutral-900">
          <div className="h-152 w-full">
            <Sidebar className="h-full w-16 border-r border-neutral-950/5 bg-zinc-100 dark:bg-neutral-950">
              <SidebarBody>
                <SidebarSection>
                  <SidebarItem current aria-label="Home">
                    <HouseIcon />
                  </SidebarItem>
                  <SidebarItem aria-label="Events">
                    <GridFourIcon />
                  </SidebarItem>
                  <SidebarItem aria-label="Orders">
                    <TicketIcon />
                  </SidebarItem>
                  <SidebarItem aria-label="Broadcasts">
                    <MegaphoneIcon />
                  </SidebarItem>
                  <SidebarItem aria-label="Search">
                    <MagnifyingGlassIcon />
                  </SidebarItem>
                </SidebarSection>
                <SidebarSpacer />
                <SidebarSection>
                  <SidebarItem aria-label="Settings">
                    <GearIcon />
                  </SidebarItem>
                  <SidebarItem aria-label="Help">
                    <QuestionIcon />
                  </SidebarItem>
                </SidebarSection>
              </SidebarBody>
            </Sidebar>
          </div>
        </div>
    );
  },
};

export const MultiLevelNested: Story = {
  parameters: {
    docs: {
      description: {
        story: "Advanced sidebar demonstrating deep hierarchical navigation with multiple nested collapsible levels, notification badges, and mixed interactive elements. Features Badge components for counters, nested Collapsible sections for sub-categories, and proper indentation hierarchy. Perfect for complex applications with extensive content organization.",
      },
    },
  },
  render: () => {
    return (
      <div className="-mx-6 flex min-w-[300px] items-start justify-center overflow-hidden border-y border-neutral-200 bg-white sm:mx-0 sm:max-w-full sm:rounded-lg sm:border dark:border-white/10 dark:bg-neutral-900">
          <div className="h-152 w-full">
            <Sidebar className="h-full w-64 border-r border-neutral-950/5 bg-zinc-100 dark:bg-neutral-950">
              <SidebarHeader>
                <div className="mb-2 flex">
                  <Link to="." aria-label="Home" className="h-5">
                    <img
                      className="size-full invert"
                      alt="Ingenuity"
                      src="https://www.ingenuity.ph/wp-content/uploads/2024/02/ingenuity-logo-2020_-light.png"
                    />
                  </Link>
                </div>
              </SidebarHeader>
              <SidebarBody>
                <SidebarSection>
                  <SidebarItem current>
                    <HouseIcon />
                    <SidebarLabel>Dashboard</SidebarLabel>
                  </SidebarItem>
                  <Collapsible defaultExpanded>
                    <Heading>
                      <SidebarItem slot="trigger">
                        <TicketIcon />
                        <SidebarLabel>Sales</SidebarLabel>
                        <span className="-my-1">
                          <Badge color="danger" content="99" />
                        </span>
                        <CaretDownIcon />
                      </SidebarItem>
                    </Heading>
                    <CollapsiblePanel bleed gapless className="px-5">
                      <SidebarItem>
                        <GridFourIcon />
                        <SidebarLabel>Orders</SidebarLabel>
                        <span className="-my-1">
                          <Badge color="warning" content="12" />
                        </span>
                      </SidebarItem>
                      <Collapsible>
                        <SidebarItem slot="trigger">
                          <EnvelopeIcon />
                          <SidebarLabel>Invoices</SidebarLabel>
                          <CaretDownIcon />
                        </SidebarItem>
                        <CollapsiblePanel bleed gapless className="px-5">
                          <SidebarItem>
                            <SidebarLabel>Pending</SidebarLabel>
                          </SidebarItem>
                          <SidebarItem>
                            <SidebarLabel>Paid</SidebarLabel>
                          </SidebarItem>
                          <SidebarItem>
                            <SidebarLabel>Overdue</SidebarLabel>
                            <Badge
                              color="danger"
                              className="ml-auto"
                              content="3"
                            />
                          </SidebarItem>
                        </CollapsiblePanel>
                      </Collapsible>
                      <SidebarItem>
                        <UserIcon />
                        <SidebarLabel>Customers</SidebarLabel>
                      </SidebarItem>
                    </CollapsiblePanel>
                  </Collapsible>
                  <Collapsible>
                    <SidebarItem slot="trigger">
                      <MegaphoneIcon />
                      <SidebarLabel>Marketing</SidebarLabel>
                      <CaretDownIcon />
                    </SidebarItem>
                    <CollapsiblePanel bleed gapless className="px-5">
                      <SidebarItem>
                        <SidebarLabel>Campaigns</SidebarLabel>
                        <Badge
                          color="success"
                          className="ml-auto"
                          content="2"
                        />
                      </SidebarItem>
                      <SidebarItem>
                        <SidebarLabel>Analytics</SidebarLabel>
                      </SidebarItem>
                      <SidebarItem>
                        <SidebarLabel>Email Lists</SidebarLabel>
                      </SidebarItem>
                    </CollapsiblePanel>
                  </Collapsible>
                </SidebarSection>
                <SidebarSpacer />
                <SidebarSection>
                  <SidebarHeading>System</SidebarHeading>
                  <SidebarItem>
                    <GearIcon />
                    <SidebarLabel>Settings</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem>
                    <QuestionIcon />
                    <SidebarLabel>Help</SidebarLabel>
                  </SidebarItem>
                </SidebarSection>
              </SidebarBody>
            </Sidebar>
          </div>
        </div>
    );
  },
};

export const DynamicWithState: Story = {
  parameters: {
    docs: {
      description: {
        story: "Demonstrates a stateful sidebar that responds to application state changes. Features dynamic notification counters, conditional sections based on feature flags, loading states, and real-time updates. Uses React state to showcase how sidebars can adapt to changing application conditions and user permissions.",
      },
    },
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [notificationCount, setNotificationCount] = useState(3);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isLoading, setIsLoading] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [hasBetaFeature, setHasBetaFeature] = useState(true);

    return (
      <>
        <div className="mb-4 flex gap-2">
          <Button
            variant="outline"
            onPress={() => {
              setNotificationCount((c) => c + 1);
            }}
          >
            Add Notification
          </Button>
          <Button
            variant="outline"
            onPress={() => {
              setIsLoading(!isLoading);
            }}
          >
            Toggle Loading
          </Button>
          <Button
            variant="outline"
            onPress={() => {
              setHasBetaFeature(!hasBetaFeature);
            }}
          >
            Toggle Beta Feature
          </Button>
        </div>
        <div className="-mx-6 flex min-w-[300px] items-start justify-center overflow-hidden border-y border-neutral-200 bg-white sm:mx-0 sm:max-w-full sm:rounded-lg sm:border dark:border-white/10 dark:bg-neutral-900">
          <div className="h-152 w-full">
            <Sidebar className="h-full w-64 border-r border-neutral-950/5 bg-zinc-100 dark:bg-neutral-950">
              <SidebarHeader>
                <MenuTrigger>
                  <SidebarItem className="mb-2.5">
                    <Avatar src="https://avatar.iran.liara.run/public" />
                    {isLoading ? "Loading..." : "Tailwind Labs"}
                    <CaretDownIcon />
                  </SidebarItem>
                  <Menu>
                    <MenuItem>
                      <GearIcon />
                      <Label>Settings</Label>
                    </MenuItem>
                    <Divider />
                    <MenuItem>
                      <Avatar
                        slot="icon"
                        src="https://avatar.iran.liara.run/public"
                      />
                      <Label>Tailwind Labs</Label>
                    </MenuItem>
                  </Menu>
                </MenuTrigger>
              </SidebarHeader>
              <SidebarBody>
                <SidebarSection>
                  <SidebarItem current>
                    <HouseIcon />
                    <SidebarLabel>Dashboard</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem>
                    <EnvelopeIcon />
                    <SidebarLabel>Messages</SidebarLabel>
                    {notificationCount > 0 && (
                      <Badge
                        color="danger"
                        className="-my-1 ml-auto"
                        content={notificationCount}
                      />
                    )}
                  </SidebarItem>
                  <SidebarItem>
                    <TicketIcon />
                    <SidebarLabel>Orders</SidebarLabel>
                    {isLoading && (
                      <span className="ml-auto animate-spin">
                        <SparkleIcon className="size-4" />
                      </span>
                    )}
                  </SidebarItem>
                  <SidebarItem>
                    <GridFourIcon />
                    <SidebarLabel>Analytics</SidebarLabel>
                  </SidebarItem>
                </SidebarSection>
                {hasBetaFeature && (
                  <>
                    <SidebarDivider />
                    <SidebarSection>
                      <SidebarHeading>
                        Beta Features
                        <Badge
                          color="primary"
                          className="-my-1 ml-2"
                          content="NEW"
                        />
                      </SidebarHeading>
                      <SidebarItem>
                        <LightbulbIcon />
                        <SidebarLabel>AI Assistant</SidebarLabel>
                        <Badge
                          color="success"
                          className="-my-1 ml-auto"
                          content="Beta"
                        />
                      </SidebarItem>
                      <SidebarItem>
                        <SparkleIcon />
                        <SidebarLabel>Advanced Reports</SidebarLabel>
                      </SidebarItem>
                    </SidebarSection>
                  </>
                )}
                <SidebarSpacer />
                <SidebarSection>
                  <SidebarItem>
                    <GearIcon />
                    <SidebarLabel>Settings</SidebarLabel>
                  </SidebarItem>
                </SidebarSection>
              </SidebarBody>
              <SidebarFooter>
                <SidebarItem>
                  <LifebuoyIcon />
                  <SidebarLabel>Support</SidebarLabel>
                  {isLoading && (
                    <span className="ml-auto text-xs text-zinc-500">
                      Checking...
                    </span>
                  )}
                </SidebarItem>
              </SidebarFooter>
            </Sidebar>
          </div>
        </div>
      </>
    );
  },
};
