import type { Wretch, WretchAddon } from "wretch";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface AuthenticatedRequestAddon {
  /**
   * Sets the `credentials` option to `include` for requests requiring auth.
   */
  authenticate: <T extends AuthenticatedRequestAddon, C, R>(
    this: T & Wretch<T, C, R>,
  ) => this;
}

/**
 * Adds the ability to use basic auth with the `Authorization` header.
 *
 * ```js
 * import BasicAuthAddon from "wretch/addons/basicAuth"
 *
 * wretch().addon(BasicAuthAddon)
 * ```
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const AuthenticatedRequestAddon: WretchAddon<AuthenticatedRequestAddon> =
  {
    wretch: {
      authenticate() {
        return this.options({ credentials: "include" });
      },
    },
  };
