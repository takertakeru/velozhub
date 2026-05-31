/* eslint-disable import/no-default-export */
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Description,
  fieldLayoutStyles,
  Label,
} from "@/components/ui/fieldset";
import { Tag, TagGroup, TagList } from "@/components/ui/tag";
import { cn } from "@/components/ui/utils";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Content/Tag",
  component: Tag,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Tags are actionable elements used for categorization, filtering, and selection. Unlike badges, tags are interactive and can be clicked, removed, or selected. Use different color variants to convey semantic meaning or visual hierarchy."
      }
    }
  },
  render: () => {
    return (
      <TagGroup aria-label="Color Roles">
        <TagList className="flex flex-wrap justify-center gap-3">
          <Tag color="primary">Primary</Tag>
          <Tag color="neutral">Neutral</Tag>
          <Tag color="success">Success</Tag>
          <Tag color="warning">Warning</Tag>
          <Tag color="danger">Error</Tag>
        </TagList>
      </TagGroup>
    );
  },
};

export const Removable: Story = {
  parameters: {
    docs: {
      description: {
        story: "When you provide an `onRemove` callback to `TagGroup`, each tag will display a dismiss button (×) that allows users to remove individual tags. This is perfect for tag management interfaces, filter lists, or user-generated content."
      }
    }
  },
  render: () => {
    return (
      <TagGroup
        aria-label="Selected Skills"
        className={cn(fieldLayoutStyles)}
        onRemove={() => {
          // Handle tag removal logic here
        }}
      >
        <Label>Selected Skills</Label>
        <TagList className="flex flex-wrap gap-3">
          <Tag color="primary">React</Tag>
          <Tag color="neutral">TypeScript</Tag>
          <Tag color="success">Node.js</Tag>
          <Tag color="warning">GraphQL</Tag>
          <Tag color="danger">Docker</Tag>
        </TagList>
        <Description className="w-full max-w-sm">
          Click the × button on any skill to remove it from your profile.
          You can always add them back later.
        </Description>
      </TagGroup>
    );
  },
};

export const Selection: Story = {
  parameters: {
    docs: {
      description: {
        story: "Use `selectionMode` to enable tag selection. Choose from `single` for exclusive selection or `multiple` to allow multiple tags to be selected simultaneously. This is ideal for filtering interfaces, category selection, or preference settings."
      }
    }
  },
  render: () => {
    return (
      <TagGroup
        aria-label="Content Categories"
        className={cn(fieldLayoutStyles)}
        selectionMode="multiple"
      >
        <Label>Content Categories</Label>
        <TagList className="flex flex-wrap gap-3">
          <Tag color="primary">Technology</Tag>
          <Tag color="neutral">Business</Tag>
          <Tag color="success">Health</Tag>
          <Tag color="warning">Finance</Tag>
          <Tag color="danger">Entertainment</Tag>
          <Tag color="info">Education</Tag>
        </TagList>
        <Description className="w-full max-w-sm">
          Select the categories you&rsquo;re interested in to personalize your
          content feed. You can choose multiple options.
        </Description>
      </TagGroup>
    );
  },
};
