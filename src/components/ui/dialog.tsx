import type React from "react";
import {
  ButtonContext,
  DEFAULT_SLOT,
  Dialog as AriaDialog,
  type DialogProps as AriaDialogProps,
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
  type ModalOverlayProps as AriaModalOverlayProps,
} from "react-aria-components";
import { XIcon } from "@phosphor-icons/react";
import { Button } from "./button";
import { surfaceStyles } from "./surface";
import { cn, createStyles, type VariantProps } from "./utils";

export { DialogTrigger } from "react-aria-components";

export const dialogStyles = createStyles({
  base: "",
  slots: {
    overlay: [
      "fixed inset-0 flex w-screen justify-center overflow-y-auto bg-neutral-950/25 px-2 py-2 focus:outline-0 sm:px-6 sm:py-8 lg:px-8 lg:py-16 dark:bg-neutral-950/65",
    ],
    root: ["fixed isolate inset-0 w-screen overflow-y-auto pt-6 sm:pt-0"],
    container: "",
    modal: [
      // Layout
      "row-start-2 w-full min-w-0",
    ],
    dialog: [
      // Extend surface
      surfaceStyles({
        border: "unset",
        className: [
          // Dialog specific border
          "ring-1 ring-neutral-950/10 outline-none dark:ring-white/10 forced-colors:outline",
        ],
      }),
      // Layout
      "relative row-start-2 w-full min-w-0 sm:mb-auto",
      // Radius
      "rounded-t-surface sm:rounded-(--radius-surface)",
      // Content Layout
      "[&>[data-slot=label]+[data-slot=description]]:mt-2",
      "[&>[data-slot=title]+[data-slot=description]]:mt-2",
      "[&>[data-slot=header]+[data-slot=content]]:mt-6",
      "[&>[data-slot=header]+[data-slot=footer]]:mt-8",
      "[&>[data-slot=content]+[data-slot=footer]]:mt-8",
    ],
  },
  variants: {
    layout: {
      unset: "",
      default: {
        container: [
          "grid min-h-full grid-rows-[1fr_auto] justify-items-center sm:grid-rows-[1fr_auto_3fr] sm:p-4",
        ],
      },
    },
    animate: {
      true: {
        overlay: [
          // Enter animations
          "entering:animate-in entering:fade-in entering:duration-200 entering:ease-out",
          // Exit animations
          "exiting:animate-out exiting:fade-out exiting:duration-200 exiting:ease-in",
        ],
        modal: [
          // Enter animations
          "entering:animate-in entering:fade-in entering:slide-in-from-bottom-10 entering:duration-200",
          // Exit animations
          "exiting:animate-out exiting:fade-out exiting:slide-out-to-bottom exiting:duration-200",
        ],
      },
      false: { base: "" },
    },
    size: {
      xs: {
        root: "[--dialog-size:var(--container-xs)]",
        modal: "sm:max-w-(--dialog-size)",
        dialog: "sm:max-w-(--dialog-size)",
      },
      sm: {
        root: "[--dialog-size:var(--container-sm)]",
        modal: "sm:max-w-(--dialog-size)",
        dialog: "sm:max-w-(--dialog-size)",
      },
      md: {
        root: "[--dialog-size:var(--container-md)]",
        modal: "sm:max-w-(--dialog-size)",
        dialog: "sm:max-w-(--dialog-size)",
      },
      lg: {
        root: "[--dialog-size:var(--container-lg)]",
        modal: "sm:max-w-(--dialog-size)",
        dialog: "sm:max-w-(--dialog-size)",
      },
      xl: {
        root: "[--dialog-size:var(--container-xl)]",
        modal: "sm:max-w-(--dialog-size)",
        dialog: "sm:max-w-(--dialog-size)",
      },
      "2xl": {
        root: "[--dialog-size:var(--container-2xl)]",
        modal: "sm:max-w-(--dialog-size)",
        dialog: "sm:max-w-(--dialog-size)",
      },
      "3xl": {
        root: "[--dialog-size:var(--container-3xl)]",
        modal: "sm:max-w-(--dialog-size)",
        dialog: "sm:max-w-(--dialog-size)",
      },
      "4xl": {
        root: "[--dialog-size:var(--container-4xl)]",
        modal: "sm:max-w-(--dialog-size)",
        dialog: "sm:max-w-(--dialog-size)",
      },
      "5xl": {
        root: "[--dialog-size:var(--container-5xl)]",
        modal: "sm:max-w-(--dialog-size)",
        dialog: "sm:max-w-(--dialog-size)",
      },
    },
  },
  defaultVariants: {
    layout: "default",
    size: "lg",
    animate: true,
  },
});

/**
 * Composed dialog styles .
 */
export const composedDialogStyles = (
  opts?: Parameters<typeof dialogStyles>[0],
) => {
  /**
   * We remove the `base` and `defaultSlot` to avoid confusion and since we don't apply styles to it.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { base, ...args } = dialogStyles(opts);

  return args;
};

type DialogVariants = VariantProps<typeof dialogStyles>;
/**
 * @internal
 */
type OwnProps = {
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
} & DialogVariants;

export type DialogProps = OwnProps &
  AriaModalOverlayProps &
  Pick<AriaDialogProps, "role">;

export function Dialog({
  size = "lg",
  isDismissable = true,
  role,
  className,
  children,
  onClose: onCloseHandler,
  ...props
}: DialogProps) {
  const { dialog, modal, overlay, root, container } = composedDialogStyles({
    size,
  });

  return (
    <AriaModalOverlay
      {...props}
      isDismissable={isDismissable}
      className={overlay()}
      onOpenChange={(isOpen) => {
        props.onOpenChange?.(isOpen);
        if (!isOpen) {
          onCloseHandler?.();
        }
      }}
    >
      {({ state }) => {
        return (
          <div className={root()}>
            <div className={container()}>
              <AriaModal className={modal()}>
                <ButtonContext.Provider
                  value={{
                    slots: {
                      [DEFAULT_SLOT]: {},
                      close: {
                        onPress: () => {
                          state.close();
                        },
                      },
                    },
                  }}
                >
                  <AriaDialog role={role} className={cn(className, dialog())}>
                    {isDismissable && (
                      <span
                        className={cn([
                          "pr-surface-gutter pt-surface-gutter absolute top-0 right-0 flex",
                        ])}
                      >
                        <Button
                          slot="close"
                          color="neutral"
                          variant="plain"
                          aria-label="Close Dialog"
                        >
                          <XIcon />
                        </Button>
                      </span>
                    )}
                    {children}
                  </AriaDialog>
                </ButtonContext.Provider>
              </AriaModal>
            </div>
          </div>
        );
      }}
    </AriaModalOverlay>
  );
}

export function AlertDialog(props: Omit<DialogProps, "isDismissable">) {
  return (
    <Dialog
      {...props}
      isKeyboardDismissDisabled
      role="alertdialog"
      isDismissable={false}
    />
  );
}
