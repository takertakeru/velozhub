/* eslint-disable import/no-default-export */
import { fn } from "storybook/test";
import {
  ArchiveIcon,
  BookmarkSimpleIcon,
  CopyIcon,
  DotsThreeVerticalIcon,
  DownloadIcon,
  EyeIcon,
  GearIcon,
  HeartIcon,
  PencilSimpleIcon,
  ShareNetworkIcon,
  SignOutIcon,
  StarIcon,
  TrashIcon,
  UserCircleIcon,
  UserIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Description, KeyboardShorcut, Label } from "@/components/ui/fieldset";
import {
  Menu,
  MenuItem,
  MenuItemLink,
  MenuSection,
  MenuTrigger,
} from "@/components/ui/menu";
import { Header } from "@/components/ui/view";

const meta = {
  title: "Collections/Menu",
  component: Menu,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: () => {
    return (
      <MenuTrigger>
        <Button variant="outline" color="neutral">
          More Options
          <DotsThreeVerticalIcon />
        </Button>
        <Menu onAction={fn()}>
          <MenuItem id="favorite">
            <HeartIcon />
            <Label>Favorite</Label>
          </MenuItem>
          <MenuItem id="edit">
            <PencilSimpleIcon />
            <Label>Edit</Label>
          </MenuItem>
          <MenuItem id="share">
            <ShareNetworkIcon />
            <Label>Share</Label>
          </MenuItem>
          <MenuItem id="delete" color="danger">
            <TrashIcon />
            <Label color="unset">Delete</Label>
          </MenuItem>
        </Menu>
      </MenuTrigger>
    );
  },
};

export const WithIcons: Story = {
  args: {},
  render: () => {
    return (
      <MenuTrigger>
        <Button variant="solid" color="primary">
          Actions
        </Button>
        <Menu>
          <MenuItemLink to="." id="bookmark">
            <BookmarkSimpleIcon />
            <Label>Bookmark</Label>
          </MenuItemLink>
          <MenuItem id="download">
            <DownloadIcon />
            <Label>Download</Label>
          </MenuItem>
          <MenuItem id="copy">
            <CopyIcon />
            <Label>Copy Link</Label>
          </MenuItem>
          <MenuItem id="archive">
            <ArchiveIcon />
            <Label>Archive</Label>
          </MenuItem>
        </Menu>
      </MenuTrigger>
    );
  },
};

export const WithSeparators: Story = {
  // parameters: {
  //   docs: {
  //     description: {
  //       story:
  //         "Use dividers to visually group related menu items. Dividers help organize complex menus and improve usability.",
  //     },
  //   },
  // },
  args: {},
  render: () => {
    return (
      <MenuTrigger>
        <Button variant="outline" color="neutral">
          <UserIcon />
          Account
        </Button>
        <Menu onAction={fn()}>
          <MenuItem id="profile">
            <UserCircleIcon />
            Profile
          </MenuItem>
          <MenuItem id="settings">
            <GearIcon />
            Settings
          </MenuItem>
          <Divider />
          <MenuItem id="logout" color="danger">
            <SignOutIcon />
            Sign Out
          </MenuItem>
        </Menu>
      </MenuTrigger>
    );
  },
};

export const WithSections: Story = {
  // parameters: {
  //   docs: {
  //     description: {
  //       story:
  //         "Group related items using MenuSection with Label for semantic organization and better accessibility.",
  //     },
  //   },
  // },
  args: {},
  render: () => {
    return (
      <MenuTrigger>
        <Button variant="outline" color="neutral">
          Options
        </Button>
        <Menu>
          <MenuSection>
            <Header className="col-span-full grid grid-cols-[1fr_auto] gap-x-12 px-3.5 pt-2 pb-1 text-sm/5 font-medium text-neutral-500 sm:px-3 sm:text-xs/5 dark:text-neutral-400">
              Actions
            </Header>
            <MenuItem id="edit">
              <PencilSimpleIcon />
              <Label>Edit</Label>
            </MenuItem>
            <MenuItem id="copy">
              <CopyIcon />
              <Label>Copy</Label>
            </MenuItem>
          </MenuSection>
          <Divider />
          <MenuSection>
            <Header className="col-span-full grid grid-cols-[1fr_auto] gap-x-12 px-3.5 pt-2 pb-1 text-sm/5 font-medium text-neutral-500 sm:px-3 sm:text-xs/5 dark:text-neutral-400">
              View
            </Header>
            <MenuItem id="preview">
              <EyeIcon />
              <Label>Preview</Label>
            </MenuItem>
            <MenuItem id="download">
              <DownloadIcon />
              Download
            </MenuItem>
          </MenuSection>
          <Divider />
          <MenuSection>
            <Header className="col-span-full grid grid-cols-[1fr_auto] gap-x-12 px-3.5 pt-2 pb-1 text-sm/5 font-medium text-neutral-500 sm:px-3 sm:text-xs/5 dark:text-neutral-400">
              Manage
            </Header>
            <MenuItem id="archive">
              <ArchiveIcon />
              Archive
            </MenuItem>
            <MenuItem id="delete" color="danger">
              <TrashIcon />
              Delete
            </MenuItem>
          </MenuSection>
        </Menu>
      </MenuTrigger>
    );
  },
};

export const WithDescriptions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Add descriptions to menu items for additional context using Description component.",
      },
    },
  },
  args: {},
  render: () => {
    return (
      <MenuTrigger>
        <Button variant="outline" color="neutral">
          More
        </Button>
        <Menu onAction={fn()}>
          <MenuItem id="share">
            <ShareNetworkIcon />
            <Label>Share</Label>
            <Description>Send to others</Description>
          </MenuItem>
          <MenuItem id="export">
            <DownloadIcon />
            <Label>Export</Label>
            <Description>Download as file</Description>
          </MenuItem>
          <MenuItem id="archive">
            <ArchiveIcon />
            <Label>Archive</Label>
            <Description>Move to archive</Description>
          </MenuItem>
        </Menu>
      </MenuTrigger>
    );
  },
};

export const ColorVariants: Story = {
  // parameters: {
  //   docs: {
  //     description: {
  //       story:
  //         "Menu items support different color variants to indicate different types of actions or states.",
  //     },
  //   },
  // },
  args: {},
  render: () => {
    return (
      <MenuTrigger>
        <Button variant="outline" color="neutral">
          Actions
        </Button>
        <Menu onAction={fn()}>
          <MenuItem id="neutral" color="neutral">
            <EyeIcon />
            <Label>View (Neutral)</Label>
          </MenuItem>
          <MenuItem id="primary" color="primary">
            <StarIcon />
            <Label>Featured (Primary)</Label>
          </MenuItem>
          <MenuItem id="success" color="success">
            <DownloadIcon />
            <Label>Download (Success)</Label>
          </MenuItem>
          <MenuItem id="warning" color="warning">
            <ArchiveIcon />
            <Label>Archive (Warning)</Label>
          </MenuItem>
          <MenuItem id="danger" color="danger">
            <TrashIcon />
            <Label>Delete (Danger)</Label>
          </MenuItem>
          <MenuItem id="info" color="info">
            <CopyIcon />
            <Label>Copy (Info)</Label>
          </MenuItem>
        </Menu>
      </MenuTrigger>
    );
  },
};

export const DisabledItems: Story = {
  // parameters: {
  //   docs: {
  //     description: {
  //       story:
  //         "Menu items can be disabled when actions are not available. Disabled items are not focusable and cannot be selected.",
  //     },
  //   },
  // },
  args: {},
  render: () => {
    return (
      <MenuTrigger>
        <Button variant="outline" color="neutral">
          Document
        </Button>
        <Menu onAction={fn()}>
          <MenuItem id="edit">
            <PencilSimpleIcon />
            Edit
          </MenuItem>
          <MenuItem id="copy">
            <CopyIcon />
            Copy
          </MenuItem>
          <MenuItem isDisabled id="share">
            <ShareNetworkIcon />
            Share (Disabled)
          </MenuItem>
          <MenuItem isDisabled id="download">
            <DownloadIcon />
            Download (Disabled)
          </MenuItem>
          <Divider />
          <MenuItem id="delete" color="danger">
            <TrashIcon />
            Delete
          </MenuItem>
        </Menu>
      </MenuTrigger>
    );
  },
};

export const KeyboardShortcuts: Story = {
  args: {},
  render: () => {
    return (
      <MenuTrigger>
        <Button variant="outline" color="neutral">
          Edit
        </Button>
        <Menu className="max-w-64">
          <MenuItem id="copy">
            <CopyIcon />
            <Label>Copy</Label>
            <KeyboardShorcut keys="⌘O" />
          </MenuItem>
          <MenuItem id="paste">
            <CopyIcon />
            <Label>Paste</Label>
            <KeyboardShorcut keys="⌘V" />
          </MenuItem>
          <MenuItem id="selectAll">
            <CopyIcon />
            <Label>Select All</Label>
            <KeyboardShorcut keys="⌘A" />
          </MenuItem>
        </Menu>
      </MenuTrigger>
    );
  },
};

export const ComplexMenu: Story = {
  render: () => {
    return (
      <MenuTrigger>
        <Button color="primary">Options</Button>
        <Menu>
          <MenuSection>
            <Header className="col-span-full grid grid-cols-[1fr_auto] gap-x-12 px-3.5 pt-2 pb-1 text-sm/5 font-medium text-neutral-500 sm:px-3 sm:text-xs/5 dark:text-neutral-400">
              Quick Actions
            </Header>
            <MenuItem id="favorite">
              <HeartIcon />
              <Label>Add to Favorites</Label>
              <Description>Save for quick access</Description>
              <span className="col-start-5 row-start-1 justify-self-end text-xs text-neutral-500">
                ⌘F
              </span>
            </MenuItem>
            <MenuItem id="share">
              <ShareNetworkIcon />
              <Label>Share</Label>
              <Description>Send to others</Description>
            </MenuItem>
          </MenuSection>
          <MenuSection>
            <Header className="col-span-full grid grid-cols-[1fr_auto] gap-x-12 px-3.5 pt-2 pb-1 text-sm/5 font-medium text-neutral-500 sm:px-3 sm:text-xs/5 dark:text-neutral-400">
              File Operations
            </Header>
            <MenuItem id="download">
              <DownloadIcon />
              <Label>Download</Label>
              <Description>Save to device</Description>
              <span className="col-start-5 row-start-1 justify-self-end text-xs text-neutral-500">
                ⌘D
              </span>
            </MenuItem>
            <MenuItem id="copy">
              <CopyIcon />
              <Label>Copy Link</Label>
              <span className="col-start-5 row-start-1 justify-self-end text-xs text-neutral-500">
                ⌘C
              </span>
            </MenuItem>
            <MenuItem isDisabled id="export">
              <ArchiveIcon />
              <Label>Export</Label>
              <Description>Not available in demo</Description>
            </MenuItem>
          </MenuSection>
        </Menu>
      </MenuTrigger>
    );
  },
};
