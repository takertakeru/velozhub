/* eslint-disable import/no-default-export */
import { MenuTrigger } from "react-aria-components";
import {
  GearIcon,
  LightbulbIcon,
  ShieldCheckIcon,
  SignOutIcon,
  UserIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AvatarButton } from "@/components/ui/avatar";
import { Divider } from "@/components/ui/divider";
import { Label } from "@/components/ui/fieldset";
import { Link } from "@/components/ui/link";
import { Menu, MenuItem } from "@/components/ui/menu";
import {
  Navbar,
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
} from "@/components/ui/navbar";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Navigation/Navbar",
  component: Navbar,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <div className="w-2xl">
        <Navbar>
          <NavbarSection>
            <NavbarItem current>Home</NavbarItem>
            <NavbarItem>Events</NavbarItem>
            <NavbarItem>Orders</NavbarItem>
          </NavbarSection>
          <NavbarSpacer />
          <NavbarSection>
            <MenuTrigger>
              <AvatarButton
                className="size-8"
                src="https://i.pravatar.cc/150?img=3"
              />
              <Menu className="min-w-64">
                <MenuItem>
                  <UserIcon />
                  <Label>My profile</Label>
                </MenuItem>
                <MenuItem>
                  <GearIcon />
                  <Label>Settings</Label>
                </MenuItem>
                <Divider inset="unset" />
                <MenuItem>
                  <ShieldCheckIcon />
                  <Label>Privacy policy</Label>
                </MenuItem>
                <MenuItem>
                  <LightbulbIcon />
                  <Label>Share feedback</Label>
                </MenuItem>
                <Divider inset="unset" />
                <MenuItem>
                  <SignOutIcon weight="fill" />
                  <Label>Sign out</Label>
                </MenuItem>
              </Menu>
            </MenuTrigger>
          </NavbarSection>
        </Navbar>
      </div>
    );
  },
};

export const WithLogo: Story = {
  render: () => {
    return (
      <div className="w-2xl">
        <Navbar>
          <Link to="." aria-label="Home" className="h-5">
            <img
              className="size-full invert"
              alt="Ingenuity"
              src="https://www.ingenuity.ph/wp-content/uploads/2024/02/ingenuity-logo-2020_-light.png"
            />
          </Link>
          <Divider
            inset="unset"
            orientation="vertical"
            className="h-6 max-lg:hidden"
          />
          <NavbarSection className="max-lg:hidden">
            <NavbarItem current>Home</NavbarItem>
            <NavbarItem>Events</NavbarItem>
            <NavbarItem>Orders</NavbarItem>
          </NavbarSection>
        </Navbar>
      </div>
    );
  },
};
