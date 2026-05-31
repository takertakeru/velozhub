import type { Decorator, Preview } from "@storybook/react-vite";
import "../src/styles.css";

import {
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { IconContext } from "@phosphor-icons/react";

export const RouterDecorator: Decorator = (Story) => {
  const rootRoute = createRootRoute({
    component: () => <Story />,
  });

  const routeTree = rootRoute;

  const router = createRouter({
    routeTree,
  });

  return (
    <IconContext
      value={{
        // @ts-expect-error
        "data-slot": "icon",
      }}
    >
      <RouterProvider router={router} />
    </IconContext>
  );
};

const preview: Preview = {
  decorators: [RouterDecorator],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export default preview;
