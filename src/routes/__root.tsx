import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import { IconContext } from "@phosphor-icons/react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
// import { AreyouSure } from "~/libs/callable";
import { ToastRegion } from "@/components/ui/toast";
import { AreyouSure } from "@/libs/callable";
import { queryClient, QueryProvider } from "@/libs/query/query-client";

export const Route = createRootRoute({
  context: () => {
    return {
      queryClient,
    };
  },
  component: () => {
    return (
      <QueryProvider>
        <IconContext
          value={{
            // @ts-expect-error
            "data-slot": "icon",
          }}
        >
          <Outlet />
          <ToastRegion />
          <AreyouSure.Root />
          <TanStackRouterDevtools />
        </IconContext>
      </QueryProvider>
    );
  },
});
