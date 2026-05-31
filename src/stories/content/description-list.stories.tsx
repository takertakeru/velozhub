/* eslint-disable import/no-default-export */
import {
  PaperclipIcon,
  PencilSimpleIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "@/components/ui/description-list";
import { Divider } from "@/components/ui/divider";
import { Description, Label } from "@/components/ui/fieldset";
import { Link } from "@/components/ui/link";
import { EnhancerGroup, Group } from "@/components/ui/utils";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Content/Description List",
  component: DescriptionList,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof DescriptionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <DescriptionList>
        <DescriptionTerm>Customer</DescriptionTerm>
        <DescriptionDetails>Michael Foster</DescriptionDetails>

        <DescriptionTerm>Event</DescriptionTerm>
        <DescriptionDetails>Bear Hug: Live in Concert</DescriptionDetails>

        <DescriptionTerm>Amount</DescriptionTerm>
        <DescriptionDetails>$150.00 USD</DescriptionDetails>

        <DescriptionTerm>Amount after exchange rate</DescriptionTerm>
        <DescriptionDetails>US$150.00 &rarr; CA$199.79</DescriptionDetails>

        <DescriptionTerm>Fee</DescriptionTerm>
        <DescriptionDetails>$4.79 USD</DescriptionDetails>

        <DescriptionTerm>Net</DescriptionTerm>
        <DescriptionDetails>$1,955.00</DescriptionDetails>
      </DescriptionList>
    );
  },
};

export const LeftAligned: Story = {
  render: () => {
    return (
      <Card>
        <div>
          <Label className="font-medium">Applicant Information</Label>
          <Description>Personal details and application.</Description>
        </div>
        <DescriptionList className="mx-[calc(var(--gutter)*-1)]">
          <DescriptionTerm className="px-(--gutter)">Full name</DescriptionTerm>
          <DescriptionDetails className="px-(--gutter)">
            Margot Foster
          </DescriptionDetails>
          <DescriptionTerm className="px-(--gutter)">
            Application for
          </DescriptionTerm>
          <DescriptionDetails className="px-(--gutter)">
            Backend Developer
          </DescriptionDetails>
          <DescriptionTerm className="px-(--gutter)">
            Email address
          </DescriptionTerm>
          <DescriptionDetails className="px-(--gutter)">
            margotfoster@example.com
          </DescriptionDetails>
          <DescriptionTerm className="px-(--gutter)">
            Salary expectation
          </DescriptionTerm>
          <DescriptionDetails className="px-(--gutter)">
            $120,000
          </DescriptionDetails>
          <DescriptionTerm className="px-(--gutter)">About</DescriptionTerm>
          <DescriptionDetails className="px-(--gutter)">
            Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim
            incididunt cillum culpa consequat. Excepteur qui ipsum aliquip
            consequat sint. Sit id mollit nulla mollit nostrud in ea officia
            proident. Irure nostrud pariatur mollit ad adipisicing reprehenderit
            deserunt qui eu.
          </DescriptionDetails>
          <DescriptionTerm className="px-(--gutter)">
            Attachments
          </DescriptionTerm>
          <DescriptionDetails className="px-(--gutter)">
            <Card density="compact">
              <EnhancerGroup className="w-full items-center">
                <PaperclipIcon />
                <Label className="min-w-0 truncate">
                  resume_back_end_developer.pdf
                </Label>
                <Button
                  variant="plain"
                  color="primary"
                  inset={["top", "bottom", "right"]}
                  className="ml-auto"
                >
                  Download
                </Button>
              </EnhancerGroup>
              <Divider />
              <EnhancerGroup className="w-full items-center">
                <PaperclipIcon />
                <Label className="min-w-0 truncate">
                  resume_back_end_developer.pdf
                </Label>
                <Button
                  variant="plain"
                  color="primary"
                  inset={["top", "bottom", "right"]}
                  className="ml-auto"
                >
                  Download
                </Button>
              </EnhancerGroup>
            </Card>
          </DescriptionDetails>
        </DescriptionList>
      </Card>
    );
  },
};

export const TwoColumn: Story = {
  render: () => {
    return (
      <div className="w-xl">
        <div>
          <Label className="font-medium">Applicant Information</Label>
          <Description>Personal details and application.</Description>
        </div>
        <DescriptionList className="gap-surface-gap mt-surface-gap [--cols:2]">
          <div className="col-span-full grid grid-cols-subgrid">
            <Group className="group">
              <DescriptionTerm>Full name</DescriptionTerm>
              <DescriptionDetails>Margot Foster</DescriptionDetails>
            </Group>
            <Group className="group">
              <DescriptionTerm>Application for</DescriptionTerm>
              <DescriptionDetails>Backend Developer</DescriptionDetails>
            </Group>
          </div>
          <Divider className="col-span-full" inset="unset" />
          <div className="col-span-full grid grid-cols-subgrid">
            <Group className="group">
              <DescriptionTerm>Email address</DescriptionTerm>
              <DescriptionDetails>margotfoster@example.com</DescriptionDetails>
            </Group>

            <Group className="group">
              <DescriptionTerm>Phone</DescriptionTerm>
              <DescriptionDetails>+1 (555) 123-4567</DescriptionDetails>
            </Group>
          </div>
          <Divider className="col-span-full" inset="unset" />
          <Group className="group col-span-full">
            <DescriptionTerm>About</DescriptionTerm>
            <DescriptionDetails>
              Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim
              incididunt cillum culpa consequat. Excepteur qui ipsum aliquip
              consequat sint. Sit id mollit nulla mollit nostrud in ea officia
              proident. Irure nostrud pariatur mollit ad adipisicing
              reprehenderit deserunt qui eu.
            </DescriptionDetails>
          </Group>
          <Divider className="col-span-full" inset="unset" />
          <Group className="group">
            <DescriptionTerm>Salary expectation</DescriptionTerm>
            <DescriptionDetails>$120,000</DescriptionDetails>
          </Group>

          <Group className="group">
            <DescriptionTerm>Experience</DescriptionTerm>
            <DescriptionDetails>5 years</DescriptionDetails>
          </Group>
          <Group className="group col-span-full">
            <DescriptionTerm>Attachments</DescriptionTerm>
            <DescriptionDetails className="mt-3">
              <Card density="compact">
                <EnhancerGroup className="w-full items-center">
                  <PaperclipIcon />
                  <Label className="min-w-0 truncate">
                    resume_back_end_developer.pdf
                  </Label>
                  <Button
                    variant="plain"
                    color="primary"
                    inset={["top", "bottom", "right"]}
                    className="ml-auto"
                  >
                    Download
                  </Button>
                </EnhancerGroup>
                <Divider />
                <EnhancerGroup className="w-full items-center">
                  <PaperclipIcon />
                  <Label className="min-w-0 truncate">
                    resume_back_end_developer.pdf
                  </Label>
                  <Button
                    variant="plain"
                    color="primary"
                    inset={["top", "bottom", "right"]}
                    className="ml-auto"
                  >
                    Download
                  </Button>
                </EnhancerGroup>
              </Card>
            </DescriptionDetails>
          </Group>
        </DescriptionList>
      </div>
    );
  },
};

export const WithInlineActions: Story = {
  render: () => {
    return (
      <div className="max-w-lg">
        <DescriptionList>
          <DescriptionTerm>Full name</DescriptionTerm>
          <DescriptionDetails className="flex items-center justify-between">
            <span>Margot Foster</span>
            <Button variant="plain" size="sm" inset={["top", "bottom"]}>
              <PencilSimpleIcon className="h-4 w-4" />
            </Button>
          </DescriptionDetails>

          <DescriptionTerm>Email address</DescriptionTerm>
          <DescriptionDetails className="flex items-center justify-between">
            <Link to="." href="mailto:margotfoster@example.com">
              margotfoster@example.com
            </Link>
            <Button variant="plain" size="sm" inset={["top", "bottom"]}>
              <PencilSimpleIcon className="h-4 w-4" />
            </Button>
          </DescriptionDetails>

          <DescriptionTerm>Phone number</DescriptionTerm>
          <DescriptionDetails className="flex items-center justify-between">
            <span>+1 (555) 123-4567</span>
            <div className="flex gap-1">
              <Button variant="plain" size="sm" inset={["top", "bottom"]}>
                <PencilSimpleIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="plain"
                size="sm"
                color="danger"
                inset={["top", "bottom"]}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          </DescriptionDetails>
        </DescriptionList>
      </div>
    );
  },
};
