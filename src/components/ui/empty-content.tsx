import type React from "react";
import { EmptyIcon } from "@phosphor-icons/react";

export function EmptyContent({
  label,
  description,
}: {
  label: string;
  description: React.ReactNode;
}) {
  return (
    <div
      className="flex h-60 flex-col items-center justify-center gap-y-4 text-neutral-700"
      data-testid="empty-document-state"
    >
      <EmptyIcon className="h-12 w-12" />

      <div className="text-center">
        <h3 className="text-label-md font-semibold">{label}</h3>

        <p className="text-paragraph-sm mt-1 max-w-[60ch] text-neutral-400">
          {description}
        </p>
      </div>
    </div>
  );
}
