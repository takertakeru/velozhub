import { useState } from "react";
import { useViewportSize } from "@react-aria/utils";
import { Drawer } from "../ui/drawer";
import { NavbarItem } from "../ui/navbar";

function OpenMenuIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M2 6.75C2 6.33579 2.33579 6 2.75 6H17.25C17.6642 6 18 6.33579 18 6.75C18 7.16421 17.6642 7.5 17.25 7.5H2.75C2.33579 7.5 2 7.16421 2 6.75ZM2 13.25C2 12.8358 2.33579 12.5 2.75 12.5H17.25C17.6642 12.5 18 12.8358 18 13.25C18 13.6642 17.6642 14 17.25 14H2.75C2.33579 14 2 13.6642 2 13.25Z" />
    </svg>
  );
}

function MobileSidebar({
  open,
  close,
  children,
}: React.PropsWithChildren<{ open: boolean; close: () => void }>) {
  return (
    <Drawer
      isOpen={open}
      position="left"
      inset={["left", "top", "bottom"]}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          close();
        }
      }}
    >
      {children}
    </Drawer>
  );
}

export function StackedLayout({
  navbar,
  sidebar,
  children,
}: React.PropsWithChildren<{
  navbar: React.ReactNode;
  sidebar: React.ReactNode;
}>) {
  const [shouldShowSidebar, setShouldShowSidebar] = useState(false);
  const { height } = useViewportSize();

  return (
    <div className="relative isolate flex w-full flex-col bg-white md:h-screen dark:bg-neutral-900 dark:lg:bg-neutral-950">
      {/* Sidebar on mobile */}
      <MobileSidebar
        open={shouldShowSidebar}
        close={() => {
          setShouldShowSidebar(false);
        }}
      >
        {sidebar}
      </MobileSidebar>

      {/* Navbar */}
      <header className="flex items-center px-4">
        <div className="py-2.5 md:hidden">
          <NavbarItem
            aria-label="Open navigation"
            onPress={() => {
              setShouldShowSidebar(true);
            }}
          >
            <OpenMenuIcon />
          </NavbarItem>
        </div>
        <div className="min-w-0 flex-1">{navbar}</div>
      </header>

      {/* Content */}
      {/* <Divider inset="none" /> */}
      <main className="flex flex-1 flex-col">
        <div
          className="relative flex grow flex-col lg:bg-white lg:shadow-xs lg:ring-1 lg:ring-neutral-950/5 dark:lg:bg-neutral-900 dark:lg:ring-white/10"
          style={{
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            "--layout-content-top-offset": "56px",
            "--layout-available-content-height": `calc(${height}px - var(--layout-content-top-offset))`,
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
