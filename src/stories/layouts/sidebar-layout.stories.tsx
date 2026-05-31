/* eslint-disable import/no-default-export */
import { MenuTrigger } from "react-aria-components";
import {
  CaretDownIcon,
  CaretUpDownIcon,
  GearIcon,
  HouseIcon,
  LightbulbIcon,
  MagicWandIcon,
  MagnifyingGlassIcon,
  MailboxIcon,
  MegaphoneIcon,
  PlusIcon,
  QuestionMarkIcon,
  ShieldCheckIcon,
  SignOutIcon,
  SquareIcon,
  TicketIcon,
  UserIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  SidebarLayout,
  SidebarLayoutContent,
} from "@/components/layouts/sidebar-layout";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CheckboxField } from "@/components/ui/checkbox";
import { Divider } from "@/components/ui/divider";
import { Description, Label } from "@/components/ui/fieldset";
import { InputField } from "@/components/ui/input";
import { Menu, MenuItem } from "@/components/ui/menu";
import {
  Navbar,
  NavbarDivider,
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
} from "@/components/ui/navbar";
import { Option, SelectField } from "@/components/ui/select";
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
import { Title } from "@/components/ui/text";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Layouts/Sidebar Layout",
  component: SidebarLayout,
  decorators: (Story) => {
    return (
      <div className="w-full">
        <Story />
      </div>
    );
  },
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SidebarLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { navbar: null, sidebar: null },
  render: () => {
    return (
      <SidebarLayout
        navbar={
          <Navbar>
            <NavbarSpacer />
            <NavbarSection>
              <NavbarItem href="/search" aria-label="Search">
                <MagnifyingGlassIcon />
              </NavbarItem>
              <NavbarItem href="/inbox" aria-label="Inbox">
                <MailboxIcon />
              </NavbarItem>
              <MenuTrigger>
                <NavbarItem>
                  <Avatar
                    shape="square"
                    src="https://avatar.iran.liara.run/public"
                  />
                </NavbarItem>
                <Menu className="min-w-64">
                  <MenuItem href="/my-profile">
                    <UserIcon />
                    <Label>My profile</Label>
                  </MenuItem>
                  <MenuItem href="/settings">
                    <GearIcon />
                    <Label>Settings</Label>
                  </MenuItem>
                  <NavbarDivider />
                  <MenuItem href="/privacy-policy">
                    <ShieldCheckIcon />
                    <Label>Privacy policy</Label>
                  </MenuItem>
                  <MenuItem href="/share-feedback">
                    <LightbulbIcon />
                    <Label>Share feedback</Label>
                  </MenuItem>
                  <NavbarDivider />
                  <MenuItem href="/logout">
                    <SignOutIcon />
                    <Label>Sign out</Label>
                  </MenuItem>
                </Menu>
              </MenuTrigger>
            </NavbarSection>
          </Navbar>
        }
        sidebar={
          <Sidebar>
            <SidebarHeader>
              <MenuTrigger>
                <SidebarItem className="lg:mb-2.5">
                  <Avatar src="/tailwind-logo.svg" />
                  <SidebarLabel>Tailwind Labs</SidebarLabel>
                  <CaretDownIcon />
                </SidebarItem>
                <Menu className="min-w-80 lg:min-w-64">
                  <MenuItem href="/teams/1/settings">
                    <GearIcon />
                    <Label>Settings</Label>
                  </MenuItem>
                  <SidebarDivider />
                  <MenuItem href="/teams/1">
                    <Avatar slot="icon" src="/tailwind-logo.svg" />
                    <Label>Tailwind Labs</Label>
                  </MenuItem>
                  <MenuItem href="/teams/2">
                    <Avatar
                      slot="icon"
                      initials="WC"
                      className="bg-purple-500 text-white"
                    />
                    <Label>Workcation</Label>
                  </MenuItem>
                  <SidebarDivider />
                  <MenuItem href="/teams/create">
                    <PlusIcon />
                    <Label>New team&hellip;</Label>
                  </MenuItem>
                </Menu>
              </MenuTrigger>
              <SidebarSection className="max-lg:hidden">
                <SidebarItem href="/search">
                  <MagnifyingGlassIcon />
                  <SidebarLabel>Search</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="/inbox">
                  <MailboxIcon />
                  <SidebarLabel>Inbox</SidebarLabel>
                </SidebarItem>
              </SidebarSection>
            </SidebarHeader>
            <SidebarBody>
              <SidebarSection>
                <SidebarItem href="/">
                  <HouseIcon />
                  <SidebarLabel>Home</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="/events">
                  <SquareIcon />
                  <SidebarLabel>Events</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="/orders">
                  <TicketIcon />
                  <SidebarLabel>Orders</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="/settings">
                  <GearIcon />
                  <SidebarLabel>Settings</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="/broadcasts">
                  <MegaphoneIcon />
                  <SidebarLabel>Broadcasts</SidebarLabel>
                </SidebarItem>
              </SidebarSection>
              <SidebarSection className="max-lg:hidden">
                <SidebarHeading>Upcoming Events</SidebarHeading>
                <SidebarItem href="/events/1">
                  Bear Hug: Live in Concert
                </SidebarItem>
                <SidebarItem href="/events/2">Viking People</SidebarItem>
                <SidebarItem href="/events/3">Six Fingers — DJ Set</SidebarItem>
                <SidebarItem href="/events/4">We All Look The Same</SidebarItem>
              </SidebarSection>
              <SidebarSpacer />
              <SidebarSection>
                <SidebarItem href="/support">
                  <QuestionMarkIcon />
                  <SidebarLabel>Support</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="/changelog">
                  <MagicWandIcon />
                  <SidebarLabel>Changelog</SidebarLabel>
                </SidebarItem>
              </SidebarSection>
            </SidebarBody>
            <SidebarFooter className="max-lg:hidden">
              <MenuTrigger>
                <SidebarItem>
                  <span className="flex min-w-0 items-center gap-3">
                    <Avatar
                      shape="square"
                      src="/profile-photo.jpg"
                      className="size-10"
                      alt=""
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-sm/5 font-medium text-neutral-950 dark:text-white">
                        Erica
                      </span>
                      <span className="block truncate text-xs/5 font-normal text-neutral-500 dark:text-neutral-400">
                        erica@example.com
                      </span>
                    </span>
                  </span>
                  <CaretUpDownIcon />
                </SidebarItem>
                <Menu className="min-w-64">
                  <MenuItem href="/my-profile">
                    <UserIcon />
                    <Label>My profile</Label>
                  </MenuItem>
                  <MenuItem href="/settings">
                    <GearIcon />
                    <Label>Settings</Label>
                  </MenuItem>
                  <Divider />
                  <MenuItem href="/privacy-policy">
                    <ShieldCheckIcon />
                    <Label>Privacy policy</Label>
                  </MenuItem>
                  <MenuItem href="/share-feedback">
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
        }
      >
        <SidebarLayoutContent className="p-10">
          <form method="post" className="mx-auto max-w-4xl">
            <Title>Settings</Title>
            <Divider className="my-10 mt-6" />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="font-semibold">Organization Name</Label>
                <Description>
                  This will be displayed on your public profile.
                </Description>
              </div>
              <div>
                <InputField
                  aria-label="Organization Name"
                  name="name"
                  defaultValue="Catalyst"
                />
              </div>
            </section>

            <Divider subtle className="my-10" />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="font-semibold">Organization Bio</Label>
                <Description>
                  This will be displayed on your public profile. Maximum 240
                  characters.
                </Description>
              </div>
              <div>
                <InputField aria-label="Organization Bio" name="bio" />
              </div>
            </section>
            <Divider subtle className="my-10" />
            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="font-semibold">Organization Email</Label>
                <Description>
                  This is how customers can contact you for support.
                </Description>
              </div>
              <div className="space-y-4">
                <InputField
                  type="email"
                  aria-label="Organization Email"
                  name="email"
                  defaultValue="info@example.com"
                />
                <CheckboxField
                  defaultSelected
                  name="email_is_public"
                  label="Show email on public profile"
                />
              </div>
            </section>

            <Divider subtle className="my-10" />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="font-semibold">Address</Label>
                <Description>
                  This is where your organization is registered.
                </Description>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <InputField
                  aria-label="Street Address"
                  name="address"
                  placeholder="Street Address"
                  defaultValue="147 Catalyst Ave"
                  className="col-span-2"
                />
                <InputField
                  aria-label="City"
                  name="city"
                  placeholder="City"
                  defaultValue="Toronto"
                  className="col-span-2"
                />
                <SelectField
                  aria-label="Region"
                  name="region"
                  placeholder="Region"
                  defaultFieldValue="Ontario"
                >
                  <Option id="ph" textValue="Philippines">
                    <Label>Philippines</Label>
                  </Option>
                </SelectField>
                <InputField
                  aria-label="Postal code"
                  name="postal_code"
                  placeholder="Postal Code"
                  defaultValue="A1A 1A1"
                />
                <SelectField
                  aria-label="Region"
                  name="region"
                  placeholder="Region"
                  className="col-span-2"
                  defaultFieldValue="Ontario"
                >
                  <Option id="ph" textValue="Philippines">
                    <Label>Philippines</Label>
                  </Option>
                </SelectField>
              </div>
            </section>

            <Divider subtle className="my-10" />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="font-semibold">Currency</Label>
                <Description>
                  The currency that your organization will be collecting.
                </Description>
              </div>
              <div>
                <SelectField
                  aria-label="Currency"
                  name="currency"
                  defaultFieldValue="cad"
                >
                  <Option textValue="cad" id="cad">
                    CAD - Canadian Dollar
                  </Option>
                  <Option textValue="usd" id="usd">
                    USD - United States Dollar
                  </Option>
                </SelectField>
              </div>
            </section>

            <Divider subtle className="my-10" />

            <div className="flex justify-end gap-4">
              <Button variant="plain" type="reset">
                Reset
              </Button>
              <Button type="submit">Save changes</Button>
            </div>
          </form>
        </SidebarLayoutContent>
      </SidebarLayout>
    );
  },
};
