import wretch from "wretch";
// eslint-disable-next-line @typescript-eslint/naming-convention, import/no-named-as-default
import FormDataAddon from "wretch/addons/formData";
// eslint-disable-next-line @typescript-eslint/naming-convention, import/no-named-as-default
import QueryStringAddon from "wretch/addons/queryString";
import { env } from "@/env";
import { AuthenticatedRequestAddon } from "./auth-addon";

export const API_URL = env.VITE_API_URL;

// Instantiate and configure wretch base
export const baseAPI = wretch(API_URL)
  .addon(QueryStringAddon)
  .addon(FormDataAddon)
  .addon(AuthenticatedRequestAddon);

export const api = baseAPI.authenticate().resolve(async (r) => r.json());
