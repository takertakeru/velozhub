import { useState } from "react";
import { ButtonContext, DEFAULT_SLOT, Provider } from "react-aria-components";
import { type DialogProps, Drawer as Vaul } from "vaul";
import { XIcon } from "@phosphor-icons/react";
import { Button } from "./button";
import { cn } from "./utils";

export function BottomSheet({
  label,
  trigger,
  children,
  fullscreen = false,
  className,
  dismissible = true,
  ...props
}: {
  label: string;
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  fullscreen?: boolean;
} & Omit<DialogProps, "children">) {
  const [isOpen, setIsOpen] = useState(props.defaultOpen);

  return (
    <Vaul.Root
      open={isOpen}
      dismissible={dismissible}
      onOpenChange={setIsOpen}
      {...props}
      snapPoints={props.snapPoints ?? []}
      fadeFromIndex={props.fadeFromIndex ?? 0}
    >
      <Provider
        values={[
          [
            ButtonContext,
            {
              slots: {
                [DEFAULT_SLOT]: {},
                close: {
                  onPress: () => {
                    // if the component is controlled we need to run the callback to make this work
                    if (props.open !== undefined && props.onOpenChange) {
                      props.onOpenChange(false);
                    } else {
                      setIsOpen(false);
                    }
                  },
                },
              },
            },
          ],
        ]}
      >
        {trigger ? <Vaul.Trigger asChild>{trigger}</Vaul.Trigger> : null}
        <Vaul.Portal>
          <Vaul.Overlay className="fixed inset-0 bg-black/40" />
          <Vaul.Content
            aria-label={label}
            className="rounded-t-surface fixed right-0 bottom-0 left-0 h-fit bg-gray-100 outline-none"
          >
            <div
              className={cn([
                "rounded-t-surface gap-surface-gutter relative flex max-h-screen flex-col bg-white p-[var(--gutter,var(--spacing-surface))]",
                //
                fullscreen && "h-screen",
                //
                className,
              ])}
            >
              {dismissible && (
                <span className="right-surface-gutter absolute top-2 flex">
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
              <Vaul.Title className="sr-only">{label}</Vaul.Title>
              <Vaul.Description className="sr-only">
                A bottom sheet with content
              </Vaul.Description>

              {children}
            </div>
          </Vaul.Content>
        </Vaul.Portal>
      </Provider>
    </Vaul.Root>
  );
}
