import type * as React from "react";
import { Link as AriaLink } from "react-aria-components";
import { createLink, type LinkComponent } from "@tanstack/react-router";

export const Link = createLink(AriaLink);

export type LinkProps = React.ComponentProps<LinkComponent<typeof Link>>;
