/* eslint-disable import/no-default-export */
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationPages } from "@/components/ui/pagination";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Navigation/Pagination",
  component: Pagination,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A comprehensive pagination component with previous/next navigation, numbered pages, and ellipsis gaps for large datasets. Uses `PaginationPrevious`, `PaginationNext`, `PaginationPage`, and `PaginationGap` components to create a full navigation experience.",
      },
    },
  },
  render: () => {
    return (
      <Pagination count={100} defaultPageSize={10}>
        <Button variant="outline" aria-label="Previous page">
          <CaretLeftIcon />
        </Button>
        <PaginationPages />
        <Button variant="outline" aria-label="Next Page">
          <CaretRightIcon />
        </Button>
      </Pagination>
    );
  },
};

export const FirstPage: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "When users are on the first page, the previous button should be disabled. This provides clear visual feedback that there are no previous pages available and prevents navigation errors.",
      },
    },
  },
  render: () => {
    return (
      <Pagination count={660} defaultPageSize={10} defaultPage={1}>
        <Button
          slot="previous-page"
          variant="outline"
          aria-label="Previous page"
        >
          <CaretLeftIcon />
        </Button>
        <PaginationPages />
        <Button variant="outline" slot="next-page" aria-label="Next Page">
          <CaretRightIcon />
        </Button>
      </Pagination>
    );
  },
};

export const LastPage: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "When users reach the final page, the next button should be disabled. This prevents users from attempting to navigate beyond the available content and maintains a consistent disabled state styling across the interface.",
      },
    },
  },
  render: () => {
    return (
      <Pagination count={660} defaultPageSize={10} defaultPage={66}>
        <Button variant="outline" aria-label="Previous page">
          <CaretLeftIcon />
        </Button>
        <PaginationPages />
        <Button isDisabled variant="outline" aria-label="Next Page">
          <CaretRightIcon />
        </Button>
      </Pagination>
    );
  },
};

export const SimpleNavigation: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "For minimal interfaces or mobile-first designs, use only previous and next buttons without numbered pages. This reduces cognitive load and saves screen space while maintaining essential navigation functionality.",
      },
    },
  },
  render: () => {
    return (
      <Pagination count={100} defaultPageSize={10} defaultPage={5}>
        <Button variant="outline" aria-label="Previous page">
          <CaretLeftIcon />
        </Button>
        <Button variant="outline" aria-label="Next Page">
          <CaretRightIcon />
        </Button>
      </Pagination>
    );
  },
};

export const SinglePage: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "When there's only one page of content, both navigation buttons should be disabled to indicate no pagination is needed. This prevents user confusion and unnecessary navigation attempts while maintaining interface consistency.",
      },
    },
  },
  render: () => {
    return (
      <Pagination count={5} defaultPageSize={10} defaultPage={1}>
        <Button variant="outline" aria-label="Previous page">
          <CaretLeftIcon />
        </Button>
        <PaginationPages />
        <Button variant="outline" aria-label="Next Page">
          <CaretRightIcon />
        </Button>
      </Pagination>
    );
  },
};

export const WithoutGaps: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "For smaller datasets or when all pages can be displayed without overwhelming the interface, show all page numbers without gaps. This provides direct access to every page and works well for datasets with 10 or fewer pages.",
      },
    },
  },
  render: () => {
    return (
      <Pagination count={70} defaultPageSize={10} defaultPage={3}>
        <Button variant="outline" aria-label="Previous page">
          <CaretLeftIcon />
        </Button>
        <PaginationPages />
        <Button variant="outline" aria-label="Next Page">
          <CaretRightIcon />
        </Button>
      </Pagination>
    );
  },
};

export const LargeDataset: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The Pagination component uses Zag.js state machine for intelligent pagination logic. It automatically calculates page ranges, handles edge cases, and provides a smooth navigation experience. For large datasets, it intelligently shows gaps and page ranges to keep the interface manageable.",
      },
    },
  },
  render: () => {
    return (
      <Pagination count={1250} defaultPageSize={10} defaultPage={25}>
        <Button variant="outline" aria-label="Previous page">
          <CaretLeftIcon />
        </Button>
        <PaginationPages />
        <Button variant="outline" aria-label="Next Page">
          <CaretRightIcon />
        </Button>
      </Pagination>
    );
  },
};
