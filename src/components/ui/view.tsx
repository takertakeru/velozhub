import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { Header as AriaHeader } from "react-aria-components";

/**
 * Content represents the primary content within a container such as as Card or Modal.
 */
export const Content = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"section">
>(function Content(props, ref) {
  return <section {...props} data-slot="content" ref={ref} />;
});

/**
 * Header represents a header within a container.
 */
export const Header = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"header">
>(function Header(props, ref) {
  return <AriaHeader {...props} data-slot="header" ref={ref} />;
});

/**
 * Header represents a header within a container.
 */
export const Footer = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"footer">
>(function Footer(props, ref) {
  return <footer {...props} data-slot="footer" ref={ref} />;
});
