/* eslint-disable import/no-default-export */
import { useState } from "react";
import {
  Autocomplete,
  MenuTrigger,
  type SortDescriptor,
  useFilter,
} from "react-aria-components";
import { DotsThreeIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyContent } from "@/components/ui/empty-content";
import { Description, Label } from "@/components/ui/fieldset";
import { SearchField } from "@/components/ui/input";
import { Menu, MenuItem } from "@/components/ui/menu";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EnhancerGroup } from "@/components/ui/utils";

// Sample users data for stories
const users = [
  {
    id: "1",
    handle: "sarah-chen",
    name: "Sarah Chen",
    avatar: "https://www.untitledui.com/logos/images/CloudWatch.jpg",
    email: "sarah.chen@example.com",
    access: "Admin",
    status: "Active",
    joinDate: "2023-01-15",
    lastSeen: "2 hours ago",
  },
  {
    id: "2",
    handle: "mike-rodriguez",
    name: "Mike Rodriguez",
    avatar: "https://www.untitledui.com/logos/images/CloudWatch.jpg",
    email: "mike.rodriguez@example.com",
    access: "Editor",
    status: "Active",
    joinDate: "2023-03-22",
    lastSeen: "1 day ago",
  },
  {
    id: "3",
    handle: "emily-johnson",
    name: "Emily Johnson",
    avatar: "https://www.untitledui.com/logos/images/CloudWatch.jpg",
    email: "emily.johnson@example.com",
    access: "Viewer",
    status: "Inactive",
    joinDate: "2023-02-10",
    lastSeen: "1 week ago",
  },
  {
    id: "4",
    handle: "alex-thompson",
    name: "Alex Thompson",
    avatar: "https://www.untitledui.com/logos/images/CloudWatch.jpg",
    email: "alex.thompson@example.com",
    access: "Editor",
    status: "Active",
    joinDate: "2023-04-05",
    lastSeen: "5 minutes ago",
  },
  {
    id: "5",
    handle: "lisa-wang",
    name: "Lisa Wang",
    avatar: "https://www.untitledui.com/logos/images/CloudWatch.jpg",
    email: "lisa.wang@example.com",
    access: "Admin",
    status: "Active",
    joinDate: "2022-11-30",
    lastSeen: "Just now",
  },
];

function TableHeaderStub() {
  return (
    <TableHeader>
      <TableColumn isRowHeader id="name">
        Name
      </TableColumn>
      <TableColumn id="status">Status</TableColumn>
      <TableColumn id="about">About</TableColumn>
      <TableColumn id="actions">Actions</TableColumn>
    </TableHeader>
  );
}
function TableItemsStub() {
  return (
    <TableBody
      items={users}
      renderEmptyState={() => {
        return (
          <EmptyContent
            label="No Products Added"
            description="When you have added products, they will appear here"
          />
        );
      }}
    >
      {(user) => {
        return (
          <TableRow key={user.handle}>
            <TableCell textValue={user.name}>
              <EnhancerGroup className="items-center">
                <Avatar src={user.avatar} className="size-10" />
                <div>
                  <Label>{user.name}</Label>
                  <Description>{user.email}</Description>
                </div>
              </EnhancerGroup>
            </TableCell>
            <TableCell textValue={user.status}>
              <Badge content={user.status} />
            </TableCell>
            <TableCell textValue={user.email}>
              <Label className="font-medium">{user.name}</Label>
              <Description>{user.email}</Description>
            </TableCell>
            <TableCell>
              <MenuTrigger>
                <Button variant="plain" inset={["top", "bottom"]}>
                  <DotsThreeIcon weight="bold" />
                </Button>
                <Menu>
                  <MenuItem>Edit</MenuItem>
                  <MenuItem>Copy Link</MenuItem>
                  <MenuItem>Delete</MenuItem>
                </Menu>
              </MenuTrigger>
            </TableCell>
          </TableRow>
        );
      }}
    </TableBody>
  );
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Collections/Table",
  component: Table,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => {
      return (
        <Card className="w-3xl">
          <Story />
        </Card>
      );
    },
  ],
  tags: ["autodocs"],
  argTypes: {
    bleed: {
      control: "boolean",
      description: "Remove horizontal padding from table container",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    dense: {
      control: "boolean",
      description: "Reduce cell padding for more compact display",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    grid: {
      control: "boolean",
      description: "Show vertical grid lines between columns",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    striped: {
      control: "boolean",
      description: "Alternate row background colors for better readability",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
  },
  args: {
    "aria-label": "Test Table",
    bleed: false,
    dense: false,
    grid: false,
    striped: false,
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    return (
      <Table {...args} selectionMode="multiple">
        <TableHeader>
          <TableColumn isRowHeader>Name</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>About</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableItemsStub />
      </Table>
    );
  },
};

export const Striped: Story = {
  args: {
    striped: true,
  },
  render: (args) => {
    return (
      <Table {...args}>
        <TableHeaderStub />
        <TableItemsStub />
      </Table>
    );
  },
};

export const GridVariant: Story = {
  render: (args) => {
    return (
      <Table {...args} bleed>
        <TableHeaderStub />
        <TableItemsStub />
      </Table>
    );
  },
};

export const Empty: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Shows how to handle empty data states with appropriate messaging.",
      },
    },
  },
  render: (args) => {
    return (
      <Table {...args}>
        <TableHeaderStub />
        <TableBody
          renderEmptyState={() => {
            return (
              <EmptyContent
                label="No Products Added"
                description="When you have added products, they will appear here"
              />
            );
          }}
        ></TableBody>
      </Table>
    );
  },
};

export const Sortable: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Interactive sorting demonstration. Click column headers to sort the data. This showcases how sorting could be implemented with the table component.",
      },
    },
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [sorted, setSorted] = useState(users);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [descriptor, setDescriptor] = useState<SortDescriptor>();

    return (
      <Table
        {...args}
        sortDescriptor={descriptor}
        onSortChange={(nextDescriptor) => {
          setDescriptor(nextDescriptor);
          setSorted((prev) => {
            const newSorted = prev.sort((a, b) => {
              const first = a[nextDescriptor.column as keyof typeof a];
              const second = b[nextDescriptor.column as keyof typeof b];
              let cmp =
                (parseInt(first) || first) < (parseInt(second) || second)
                  ? -1
                  : 1;

              if (nextDescriptor.direction === "descending") {
                cmp = cmp * -1;
              }

              return cmp;
            });

            return newSorted;
          });
        }}
      >
        <TableHeader>
          <TableColumn isRowHeader allowsSorting id="name">
            Name
          </TableColumn>
          <TableColumn id="status">Status</TableColumn>
          <TableColumn id="about">About</TableColumn>
          <TableColumn id="actions">Actions</TableColumn>
        </TableHeader>
        <TableBody items={sorted}>
          {(user) => {
            return (
              <TableRow key={user.handle}>
                <TableCell>
                  <EnhancerGroup className="items-center">
                    <Avatar src={user.avatar} className="size-10" />
                    <div>
                      <Label>{user.name}</Label>
                      <Description>{user.email}</Description>
                    </div>
                  </EnhancerGroup>
                </TableCell>
                <TableCell>
                  <Badge content={user.status} />
                </TableCell>
                <TableCell>
                  <Label className="font-medium">{user.name}</Label>
                  <Description>{user.email}</Description>
                </TableCell>
                <TableCell>
                  <MenuTrigger>
                    <Button variant="plain" inset={["top", "bottom"]}>
                      <DotsThreeIcon weight="bold" />
                    </Button>
                    <Menu>
                      <MenuItem>Edit</MenuItem>
                      <MenuItem>Copy Link</MenuItem>
                      <MenuItem>Delete</MenuItem>
                    </Menu>
                  </MenuTrigger>
                </TableCell>
              </TableRow>
            );
          }}
        </TableBody>
      </Table>
    );
  },
};

export const SelectionMode: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates selection appearance using visual indicators. This shows how selection could be styled when implemented.",
      },
    },
  },
  render: (args) => {
    return (
      <Table {...args} selectionMode="multiple">
        <TableHeaderStub />
        <TableItemsStub />
      </Table>
    );
  },
};

export const Dense: Story = {
  args: { dense: true },
  parameters: {
    docs: {
      description: {
        story:
          "Compact table layout inspired by Untitled UI size variants. Demonstrates smaller padding and condensed information display for data-dense interfaces.",
      },
    },
  },
  render: (args) => {
    return (
      <Table {...args}>
        <TableHeader>
          <TableRow>
            <TableColumn className="">Name</TableColumn>
            <TableColumn className="">Email</TableColumn>
            <TableColumn className="">Role</TableColumn>
            <TableColumn className="">Status</TableColumn>
          </TableRow>
        </TableHeader>
        <TableItemsStub />
      </Table>
    );
  },
};

export const Searchable: Story = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks, @typescript-eslint/unbound-method
    const { contains } = useFilter({ sensitivity: "base" });

    return (
      <Autocomplete disableAutoFocusFirst filter={contains}>
        <SearchField label="Search" />
        <Table {...args}>
          <TableHeaderStub />
          <TableItemsStub />
        </Table>
      </Autocomplete>
    );
  },
};
