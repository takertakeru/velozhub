/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { VitePWA } from "vite-plugin-pwa";
import { resolve } from "node:path";

// https://vitejs.dev/config/
import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [
    TanStackRouterVite({
      autoCodeSplitting: true,
    }),
    viteReact(),
    tailwindcss(),
    VitePWA({
      // Auto-update the service worker in the background; no update prompt UI.
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.ico",
        "robots.txt",
        "veloz-icon.svg",
        "logo192.png",
        "logo512.png",
      ],
      manifest: {
        name: "VelozHub",
        short_name: "VelozHub",
        description: "Shared-car booking for the household Toyota Veloz.",
        theme_color: "#16a34a",
        background_color: "#0e1420",
        display: "standalone",
        start_url: "/",
        icons: [
          // Branded Veloz mark. SVG covers Chrome/Edge/Firefox/Android (incl.
          // maskable); the PNG stays as a fallback for platforms without SVG
          // manifest-icon support (notably older iOS).
          {
            src: "veloz-icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any",
          },
          {
            src: "veloz-icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "maskable",
          },
          { src: "logo512.png", sizes: "512x512", type: "image/png" },
        ],
      },
      workbox: {
        // SPA fallback so deep links work offline.
        navigateFallback: "/index.html",
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
      },
      // Flip to true if you want to test the installable PWA in `yarn dev`.
      devOptions: { enabled: false },
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    workspace: [
      {
        extends: true,
        test: {
          name: "app",
          setupFiles: ["./setupTests.ts"],
          include: ["**\/*.{test,spec}.?(c|m)[jt]s?(x)"],
        },
      },
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, ".storybook"),
          }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: "playwright",
            instances: [
              {
                browser: "chromium",
              },
            ],
          },
          setupFiles: [".storybook/vitest.setup.ts"],
        },
      },
    ],
  },
  optimizeDeps: {
    include: [
      "@sentry/react",
      "react-dom/client",
      "web-vitals",
      "@tanstack/react-query",
      "@t3-oss/env-core",
      "@tanstack/react-router-devtools",
      "@tanstack/zod-adapter",
      "posthog-js",
      "aws-amplify",
      "wretch",
      "wretch/addons/formData",
      "wretch/addons/queryString",
    ],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
