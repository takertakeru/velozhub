import {
  ButtonContext,
  DEFAULT_SLOT,
  Dialog as AriaDialog,
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
} from "react-aria-components";
import { XIcon } from "@phosphor-icons/react";
import { Button } from "./button";
import type { Inset } from "./constants";
import { type DialogProps, dialogStyles } from "./dialog";
import { cn, createStyles, type VariantProps } from "./utils";

const drawerStyles = createStyles({
  base: "",
  slots: {
    overlay: dialogStyles.slots.overlay,
    dialog: dialogStyles.slots.dialog,
    root: "fixed isolate inset-0 w-screen overflow-y-auto",
    container: "",
    modal: "w-full",
  },
  variants: {
    ...dialogStyles.variants,
    position: {
      right: {
        modal: "col-start-[-1]",
        container: [
          "grid grid-cols-[auto_var(--dialog-size)] sm:justify-items-end",
        ],
      },
      left: {
        container:
          "grid min-h-full h-full grid-cols-[var(--dialog-size)_auto] sm:justify-items-start",
      },
    },
    inset: {
      top: { container: ["data-[inset*=top]:pt-0"] },
      right: { container: ["data-[inset*=right]:pr-0"] },
      bottom: { container: ["data-[inset*=bottom]:pb-0"] },
      left: { container: ["data-[inset*=left]:pl-0"] },
      unset: { container: "" },
    },
    animate: {
      true: { base: "", overlay: dialogStyles.variants.animate.true.overlay },
      false: { base: "", overlay: "" },
    },
  },
  compoundVariants: [
    {
      position: "left",
      animate: true,
      className: {
        modal: [
          "entering:animate-in entering:slide-in-from-left-10 entering:durtion-200 entering:ease-out",
          //
          "exiting:fade-out exiting:animate-out exiting:duration-200 exiting:ease-in exiting:slide-out-to-left-10",
        ],
      },
    },
    {
      position: "right",
      animate: true,
      className: {
        modal: [
          "entering:animate-in entering:fade-in entering:slide-in-from-right-10 entering:durtion-200 entering:ease-out",
          //
          "exiting:animate-out exiting:fade-out exiting:slide-out-to-right-10 exiting:duration-200 exiting:ease-in",
        ],
      },
    },
  ],
  defaultVariants: {
    position: "left",
    inset: "unset",
    animate: true,
  },
});

/**
 * Internal.
 *
 * @internal
 */
const matchMultipleInset = (
  insets: Exclude<DrawerProps["inset"], undefined>,
) => {
  const resolvedInset = Array.isArray(insets) ? insets : [insets];

  return resolvedInset.map(
    (inset) => drawerStyles.variants.inset[inset].container,
  );
};

type DrawerVariants = VariantProps<typeof drawerStyles>;

type OwnProps = Omit<DrawerVariants, "inset"> & {
  inset?: Inset | Array<Inset>;
};
export type DrawerProps = DialogProps & OwnProps;

export function Drawer({
  size = "lg",
  position = "left",
  inset = "unset",
  isDismissable = true,
  role,
  className,
  children,
  onClose: onCloseHandler,
  ...props
}: DrawerProps) {
  const { overlay, root, container, dialog, modal } = drawerStyles({
    size,
    position,
  });
  const insetStyles = matchMultipleInset(inset);

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
            <div
              data-inset={inset}
              className={container({
                className: [
                  // Layout
                  insetStyles,
                ],
              })}
            >
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
                  <AriaDialog
                    role={role}
                    className={dialog({
                      className: cn([
                        "h-(--visual-viewport-height)",
                        //
                        className,
                      ]),
                    })}
                  >
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
