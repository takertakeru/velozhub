import { GridListItem } from "react-aria-components";
import { TrashIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, avatarStyles } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import {
  Description,
  Field,
  FieldGroup,
  Fieldset,
  Label,
  Legend,
} from "@/components/ui/fieldset";
import {
  AcceptedFiles,
  Dropzone,
  FileTrigger,
  FileUploadField,
  HeadlessFileUpload,
  ImagePreview,
} from "@/components/ui/file-upload";
import { composedInputStyles, InputField } from "@/components/ui/input";
import { WithTooltip } from "@/components/ui/tooltip";
import { Group } from "@/components/ui/utils";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Form/File Upload",
  component: FileUploadField,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof FileUploadField>;

// eslint-disable-next-line import/no-default-export
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const FormField: Story = {
  args: {
    label: "Upload Photos",
    description: "This photos will be used in your gallery.",
  },
};

export const TriggerOnly: Story = {
  render: () => {
    return (
      <Field>
        <Label>Photo</Label>
        <HeadlessFileUpload accept={["image/png"]} className="group">
          <div data-slot="control" className="flex items-center gap-2">
            <AcceptedFiles
              renderEmptyState={() => (
                <Avatar className="size-10" initials="A" />
              )}
            >
              {(item) => {
                return (
                  <GridListItem className="relative">
                    <ImagePreview
                      file={item.file}
                      className={avatarStyles({ className: "size-10" })}
                    />
                  </GridListItem>
                );
              }}
            </AcceptedFiles>

            <WithTooltip content="Remove selection">
              <Button
                slot="clear"
                color="danger"
                className="group-data-empty:hidden"
              >
                <TrashIcon />
              </Button>
            </WithTooltip>
            <Dropzone>
              <FileTrigger>
                <Button slot="select-file">Upload Photo</Button>
              </FileTrigger>
            </Dropzone>
          </div>
        </HeadlessFileUpload>
      </Field>
    );
  },
};

export const Form: Story = {
  render: () => {
    const { root, container, input } = composedInputStyles({
      adjoined: "left",
    });

    return (
      <form className="sm:mx-auto sm:max-w-lg">
        <Fieldset>
          <Legend>Set up your first workspace</Legend>
          <Description>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr.
          </Description>
          <FieldGroup>
            <InputField label="Workspace" />
            <Field>
              <Label>Upload File</Label>
              <HeadlessFileUpload
                accept={["image/png"]}
                className="group w-full"
              >
                <Group className="flex">
                  <FileTrigger>
                    <Button
                      slot="select-file"
                      variant="outline"
                      adjoined="right"
                    >
                      Choose a file
                    </Button>
                  </FileTrigger>
                  <Divider
                    orientation="vertical"
                    inset="unset"
                    className="h-auto self-stretch"
                  />
                  <AcceptedFiles
                    className="flex-1"
                    renderEmptyState={() => {
                      return (
                        <div
                          className={root({ className: "h-full flex-1" })}
                          data-adjoined="left"
                        >
                          <div className={container()}>
                            <span
                              className={input({
                                className: "text-brand-neutral-subtle",
                              })}
                            >
                              No file chosen
                            </span>
                          </div>
                        </div>
                      );
                    }}
                  >
                    {(item) => {
                      return (
                        <GridListItem className="relative">
                          <ImagePreview
                            file={item.file}
                            className={avatarStyles({ className: "size-10" })}
                          />
                        </GridListItem>
                      );
                    }}
                  </AcceptedFiles>
                </Group>
              </HeadlessFileUpload>
            </Field>
          </FieldGroup>
        </Fieldset>
      </form>
    );
  },
};
