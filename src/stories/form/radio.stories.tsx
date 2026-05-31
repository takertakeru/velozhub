/* eslint-disable import/no-default-export */
import { useState } from "react";
import { CheckCircleIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Description,
  Fieldset,
  HeadlessField,
  HeadlessLabel,
  Legend,
} from "@/components/ui/fieldset";
import {
  HeadlessRadioGroup,
  Radio,
  RadioField,
  RadioGroup,
  RadioOverlay,
} from "@/components/ui/radio";
import { surfaceStyles } from "@/components/ui/surface";
import { cn } from "@/components/ui/utils";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Form/Radio",
  component: RadioField,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
} satisfies Meta<typeof RadioField>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Basic: Story = {
  render: () => {
    return (
      <RadioGroup>
        <RadioField label="Allow tickets to be resold" value="permit" />
        <RadioField label="Don’t allow tickets to be resold" value="forbid" />
      </RadioGroup>
    );
  },
  args: {
    value: "",
  },
};

export const WithDescription: Story = {
  render: () => {
    return (
      <RadioGroup>
        <RadioField
          label="Allow tickets to be resold"
          description="Customers can resell or transfer their tickets if they can’t make it to the event."
          value="permit"
        />
        <RadioField
          label="Don’t allow tickets to be resold"
          description="Tickets cannot be resold or transferred to another person."
          value="forbid"
        />
      </RadioGroup>
    );
  },
  args: {
    value: "",
  },
};

export const Disabled: Story = {
  render: () => {
    return (
      <RadioGroup isDisabled>
        <RadioField
          label="Allow tickets to be resold"
          description="Customers can resell or transfer their tickets if they can’t make it to the event."
          value="permit"
        />
        <RadioField
          label="Don’t allow tickets to be resold"
          description="Tickets cannot be resold or transferred to another person."
          value="forbid"
        />
      </RadioGroup>
    );
  },
  args: {
    value: "",
  },
};

export const WithFieldset: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use the `Fieldset`, `Legend`, and `Description` components to add a title and description to a radio group:",
      },
    },
  },
  render: () => {
    return (
      <Fieldset>
        <Legend>Resale and transfers</Legend>
        <Description>
          Decide if people buy tickets from you or from scalpers.
        </Description>
        <RadioGroup name="resale" defaultValue="permit">
          <RadioField
            value="permit"
            label="Allow tickets to be resold"
            description="
              Customers can resell or transfer their tickets if they can’t make it to the event."
          />
          <RadioField
            value="forbid"
            label="Don’t allow tickets to be resold"
            description="Customers can resell or transfertheir tickets if they can’t make it to the event."
          />
        </RadioGroup>
      </Fieldset>
    );
  },
  args: {
    value: "",
  },
};

export const WithCustomLayout: Story = {
  render: () => {
    return (
      <Fieldset>
        <Legend>How would you rate your experience?</Legend>
        <HeadlessRadioGroup className="mt-4 flex gap-6 sm:gap-8">
          {[1, 2, 3, 4, 5].map((rating) => {
            return (
              <HeadlessField key={rating} className="flex items-center gap-2">
                <Radio value={String(rating)} />
                <HeadlessLabel className="text-base/6 select-none sm:text-sm/6">
                  {rating}
                </HeadlessLabel>
              </HeadlessField>
            );
          })}
        </HeadlessRadioGroup>
      </Fieldset>
    );
  },
  args: {
    value: "",
  },
};

export const CustomColor: Story = {
  render: () => {
    return (
      <Fieldset>
        <Legend>How would you rate your experience?</Legend>
        <HeadlessRadioGroup name="rating" className="mt-4 flex gap-6 sm:gap-8">
          {[1, 2, 3, 4, 5].map((rating) => {
            return (
              <HeadlessField key={rating} className="flex items-center gap-2">
                <Radio color="primary" value={String(rating)} />
                <HeadlessLabel className="text-base/6 select-none sm:text-sm/6">
                  {rating}
                </HeadlessLabel>
              </HeadlessField>
            );
          })}
        </HeadlessRadioGroup>
      </Fieldset>
    );
  },
  args: {
    value: "",
  },
};

export const WithDefaultValue: Story = {
  render: () => {
    return (
      <Fieldset>
        <Legend>How would you rate your experience?</Legend>
        <HeadlessRadioGroup
          defaultValue="1"
          name="rating"
          className="mt-4 flex gap-6 sm:gap-8"
        >
          {[1, 2, 3, 4, 5].map((rating) => {
            return (
              <HeadlessField key={rating} className="flex items-center gap-2">
                <Radio value={String(rating)} />
                <HeadlessLabel className="text-base/6 select-none sm:text-sm/6">
                  {rating}
                </HeadlessLabel>
              </HeadlessField>
            );
          })}
        </HeadlessRadioGroup>
      </Fieldset>
    );
  },
  args: {
    value: "",
  },
};

export const ControlledValue: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selected, setSelected] = useState("");

    return (
      <Fieldset>
        <Legend>How would you rate your experience?</Legend>
        <HeadlessRadioGroup
          name="rating"
          className="mt-4 flex gap-6 sm:gap-8"
          value={selected}
          onChange={setSelected}
        >
          {[1, 2, 3, 4, 5].map((rating) => {
            return (
              <HeadlessField key={rating} className="flex items-center gap-2">
                <Radio color="primary" value={String(rating)} />
                <HeadlessLabel className="text-base/6 select-none sm:text-sm/6">
                  {rating}
                </HeadlessLabel>
              </HeadlessField>
            );
          })}
        </HeadlessRadioGroup>
      </Fieldset>
    );
  },
  args: {
    value: "",
  },
};

const plans = [
  { name: "Startup", ram: "12GB", cpus: "6 CPUs", disk: "256GB SSD disk" },
  { name: "Business", ram: "16GB", cpus: "8 CPUs", disk: "512GB SSD disk" },
  { name: "Enterprise", ram: "32GB", cpus: "12 CPUs", disk: "1TB SSD disk" },
];

// eslint-disable-next-line @typescript-eslint/naming-convention
export const CustomUI: Story = {
  render: () => {
    return (
      <HeadlessRadioGroup aria-label="Server size" className="space-y-2">
        {plans.map((plan) => {
          return (
            <RadioOverlay
              key={plan.name}
              value={plan.name}
              className={cn([
                surfaceStyles(),
                //
                "group relative flex cursor-pointer rounded-lg hover:bg-neutral-800 bg-neutral-900 px-5 py-4 text-white shadow-md transition",
                // focus
                "focus:outline focus:outline-offset-2 focus-visible:outline-2",
                // outline color
                "focus-visible:outline-info-500 dark:focus-visible:outline-info-500",
              ])}
            >
              <div className="flex w-full gap-8 items-center justify-between">
                <div className="text-sm/6 text-brand-neutral-text group-hover:text-white">
                  <p className="font-semibold ">{plan.name}</p>
                  <div className="flex gap-2">
                    <div>{plan.ram}</div>
                    <div aria-hidden="true">&middot;</div>
                    <div>{plan.cpus}</div>
                    <div aria-hidden="true">&middot;</div>
                    <div>{plan.disk}</div>
                  </div>
                </div>
                <CheckCircleIcon
                  weight="fill"
                  className="size-6 opacity-0 transition group-data-selected:opacity-100"
                />
              </div>
            </RadioOverlay>
          );
        })}
      </HeadlessRadioGroup>
    );
  },
  args: {
    value: "",
  },
};
