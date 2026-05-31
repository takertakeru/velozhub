import {
  type ExternalToast,
  toast as sonnerToast,
  Toaster as ToasterPrimitive,
  type ToasterProps,
} from "sonner";
import { WarningCircleIcon } from "@phosphor-icons/react";
import { Banner } from "./banner";
import { Label } from "./fieldset";
import { Paragraph } from "./text";
import { Content } from "./view";

// export { toast as toaster };

export function toaster(message: string, data?: ExternalToast) {
  return sonnerToast.custom(
    (id) => <ToastPrimitive id={id} message={message} />,
    data,
  );
}

/** A fully custom toast that still maintains the animations and interactions. */
function ToastPrimitive({ message }: { id: string | number; message: string }) {
  return (
    <Banner color="neutral" emphasis="bold">
      <WarningCircleIcon />
      <Content>
        <Label className="align-middle font-medium" color="unset">
          {message}
        </Label>
        <Paragraph color="inherit">
          We couldn’t process your request. Please try again later.
        </Paragraph>
      </Content>
    </Banner>
  );
}

export function ToastRegion({ ...props }: ToasterProps) {
  return <ToasterPrimitive {...props} />;
}
