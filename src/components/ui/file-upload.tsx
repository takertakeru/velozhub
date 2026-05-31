import {
  type ComponentPropsWithoutRef,
  createContext,
  type PropsWithoutRef,
  useContext,
  useEffect,
  useId,
  useState,
} from "react";
import { mergeProps } from "react-aria";
import {
  ButtonContext,
  type ContextValue,
  DEFAULT_SLOT,
  GridList,
  GridListItem,
  type GridListProps as AriaGridListProps,
  Provider,
  useSlottedContext,
} from "react-aria-components";
import type { FieldPath, FieldValues } from "react-hook-form";
import { FilePdfIcon, UploadSimpleIcon } from "@phosphor-icons/react";
import * as fileUpload from "@zag-js/file-upload";
import { formatBytes } from "@zag-js/i18n-utils";
import {
  normalizeProps,
  // eslint-disable-next-line no-restricted-syntax/noPropTypes
  type PropTypes as ZagPropTypes,
  useMachine,
} from "@zag-js/react";
import { composeButtonStyles } from "./button";
import {
  Description,
  Field,
  FieldContext,
  FieldControl,
  Label,
  splitComposedFieldControlProps,
  useFieldController,
  type WithComposedFieldControlProps,
} from "./fieldset";
import { surfaceStyles } from "./surface";
import { Paragraph, TextButton, textStyles } from "./text";
import { cn } from "./utils";

type Props = fileUpload.Props;

type Api = fileUpload.Api<ZagPropTypes>;
type ItemDetails = fileUpload.ItemProps &
  PropsWithoutRef<React.HTMLAttributes<HTMLElement>>;

const FileUploadContext = createContext<ContextValue<Api, HTMLElement>>(null);

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const useFileUpload = () => useSlottedContext(FileUploadContext)!;

export function HeadlessFileUpload({
  children,
  className,
  accept = ["application/pdf"],
  fieldControlled = true,
  ...props
}: Partial<Props> & {
  className?: string;
  children: React.ReactNode;
  fieldControlled?: boolean;
}) {
  const fieldControl = useFieldController()?.field;

  const service = useMachine(fileUpload.machine, {
    accept,
    ...mergeProps(props, {
      onFileAccept: fieldControlled
        ? (details) => {
            const maxFiles = props.maxFiles ?? 1;

            if (maxFiles > 1) {
              fieldControl?.onChange(details.files);
            } else {
              fieldControl?.onChange(details.files[0]);
            }
          }
        : undefined,
      validate(file, details) {
        const maxFiles = props.maxFiles ?? 1;
        const shouldAcceptMultiple = maxFiles > 1;
        const isAlreadySelected = details.acceptedFiles.some(
          (f) => f.name === file.name,
        );

        if (isAlreadySelected && shouldAcceptMultiple) {
          return ["FILE_EXISTS"];
        }

        return null;
      },
      name: fieldControlled ? fieldControl?.name : undefined,
      disabled: fieldControlled ? fieldControl?.disabled : undefined,
    } satisfies Partial<Props>),
    id: useId(),
  });
  const api = fileUpload.connect(service, normalizeProps);

  return (
    <div
      {...api.getRootProps()}
      data-slot="control"
      data-empty={api.acceptedFiles.length === 0 || undefined}
      className={cn(className)}
    >
      <Provider
        values={[
          [FileUploadContext, api],
          [
            ButtonContext,
            {
              slots: {
                [DEFAULT_SLOT]: {},
                "select-file": {
                  ...api.getTriggerProps(),
                  /**
                   * To prevent passing deprecrated prop.
                   */
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  //@ts-ignore
                  onClick: undefined,
                  onBlur: undefined,
                  onFocus: undefined,
                  value: undefined,
                  formAction: undefined,
                  isDisabled: api.getTriggerProps().disabled,
                  onPress(e) {
                    /**
                     * Based from the source code the `currentTarget` is the only thing needed to make this work
                     * we just faked it to be able to adapt zagjs + RAC.
                     */
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    api.getTriggerProps().onClick({ currentTarget: e.target });
                  },
                },
                clear: {
                  ...api.getClearTriggerProps(),
                  onClick: undefined,
                  onBlur: undefined,
                  onFocus: undefined,
                  value: undefined,
                  formAction: undefined,
                  isDisabled: api.getTriggerProps().disabled,
                  onPress(e) {
                    /**
                     * Based from the source code the `currentTarget` is the only thing needed to make this work
                     * we just faked it to be able to adapt zagjs + RAC.
                     */
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    api.getClearTriggerProps().onClick(e.target);
                  },
                },
              },
            },
          ],
        ]}
      >
        {children}
      </Provider>
    </div>
  );
}

export type FileUploadProps = Partial<Props> & {
  className?: string;
  children?: React.ReactNode | ((item: ItemDetails) => React.ReactNode);
};

export function FileUpload({ className, ...props }: FileUploadProps) {
  return (
    <HeadlessFileUpload
      {...props}
      className={cn(["flex flex-col gap-4", className])}
    >
      <Dropzone
        className={surfaceStyles({
          border: "unset",
          color: "unset",
          className: [
            //
            "items-center",
            //
            "group-data-invalid/field:border-red-500",
            "border-surface-border border border-dashed bg-neutral-50",
          ],
        })}
      >
        <span className="bg-surface-background flex size-10 shrink-0 items-center justify-center rounded-full p-1">
          <UploadSimpleIcon className="size-5" />
        </span>
        <div className="text-center">
          <Paragraph size="sm" className="font-medium">
            <TextButton slot="select-file" color="primary">
              Click to upload
            </TextButton>{" "}
            or Drag your file(s) here
          </Paragraph>
          <Paragraph color="unset" size="xs" className="mt-1 text-neutral-400">
            SVG, PNG, JPG or GIF (max. 800x400px)
          </Paragraph>
        </div>
      </Dropzone>
      <AcceptedFiles className={cn(["empty:hidden"])} />
    </HeadlessFileUpload>
  );
}

export function FileUploadField<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: WithComposedFieldControlProps<
    FileUploadProps,
    TFieldValues,
    TFieldName
  >,
) {
  const [composedFeldProps, { className, ...fileUploadProps }] =
    splitComposedFieldControlProps(props);
  const { label, description, ...fieldControlProps } = composedFeldProps;

  if (fieldControlProps.control && fieldControlProps.field) {
    return (
      <FieldControl
        {...fieldControlProps}
        field={fieldControlProps.field}
        control={fieldControlProps.control}
        className={className}
      >
        {label ? <Label>{label}</Label> : null}
        <FileUpload {...fileUploadProps} />
        {description ? <Description>{description}</Description> : null}
      </FieldControl>
    );
  }

  return (
    <Field className={className}>
      {label ? <Label>{label}</Label> : null}
      <FileUpload {...fileUploadProps} />
      {description ? <Description>{description}</Description> : null}
    </Field>
  );
}

export function AcceptedFiles({
  children,
  ...props
}: Omit<AriaGridListProps<ItemDetails>, "items">) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const api = useSlottedContext(FileUploadContext)!;

  return (
    <GridList
      selectionMode="none"
      {...mergeProps(api.getItemGroupProps(), props)}
      aria-label="Files Selected"
      data-empty={api.acceptedFiles.length === 0 || undefined}
      items={api.acceptedFiles.map((file) => {
        return {
          ...api.getItemProps({ file }),
          file,
        };
      })}
    >
      {children === undefined
        ? (item) => {
            return <DefaultItem api={api} {...(item as ItemDetails)} />;
          }
        : children}
    </GridList>
  );
}

/**
 * @internal
 * Dummy context so we can check presence
 */
const DropzoneContext = createContext(null);

export function Dropzone({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const field = useSlottedContext(FieldContext);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const api = useSlottedContext(FileUploadContext)!;

  return (
    <DropzoneContext.Provider value={null}>
      <div data-slot="upload-container" className={className}>
        <div {...api.getDropzoneProps()} data-rac>
          <input
            {...api.getHiddenInputProps()}
            aria-label={field?.["aria-label"]}
            aria-describedby={field?.["aria-describedby"]}
            aria-labelledby={field?.["aria-labelledby"]}
          />
        </div>
        {children}
      </div>
    </DropzoneContext.Provider>
  );
}

export function FileTrigger({ children }: { children: React.ReactNode }) {
  const isWithinHandler = Boolean(useSlottedContext(FileUploadContext));
  const isWithinDropzone = Boolean(useContext(DropzoneContext));

  if (!isWithinHandler) {
    return (
      <HeadlessFileUpload className="contents">
        <Dropzone className="contents">{children}</Dropzone>
      </HeadlessFileUpload>
    );
  }

  if (!isWithinDropzone) {
    return <Dropzone className="contents">{children}</Dropzone>;
  }

  return children;
}

export function ImagePreview({
  file,
  ...props
}: ComponentPropsWithoutRef<"img"> & { file: File }) {
  const api = useFileUpload();
  const [url, setUrl] = useState("");

  useEffect(() => {
    api.createFileUrl(file, setUrl);
  }, [file, api]);

  if (!url) {
    return null;
  }

  return <img {...props} src={url} alt={file.name} />;
}

function DefaultItem({ api, ...props }: ItemDetails & { api: Api }) {
  const triggerStyles = composeButtonStyles("plain", { color: "danger" });

  return (
    <GridListItem
      className={cn([
        surfaceStyles({
          orientation: "horizontal",
          padding: "unset",
          className: "p-3",
        }),
      ])}
    >
      <div className="flex items-center gap-2">
        <span className="bg-brand-primary-50 text-brand-primary-800 size-8 rounded p-1">
          <FilePdfIcon />
        </span>
        <div className="space-y-1">
          <div
            {...api.getItemNameProps({ file: props.file })}
            className={cn([
              textStyles({ label: "sm", className: "font-medium" }),
            ])}
          >
            {props.file.name}
          </div>
          <Paragraph>{formatBytes(props.file.size)}</Paragraph>
        </div>
      </div>
      <button
        {...api.getItemDeleteTriggerProps({ file: props.file })}
        className={triggerStyles}
      >
        Remove
      </button>
    </GridListItem>
  );
}
