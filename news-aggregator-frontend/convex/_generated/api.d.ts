/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as autoPostRules from "../autoPostRules.js";
import type * as locations from "../locations.js";
import type * as news from "../news.js";
import type * as predictions from "../predictions.js";
import type * as seed from "../seed.js";
import type * as settings from "../settings.js";
import type * as socialAccounts from "../socialAccounts.js";
import type * as trendTimeline from "../trendTimeline.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  autoPostRules: typeof autoPostRules;
  locations: typeof locations;
  news: typeof news;
  predictions: typeof predictions;
  seed: typeof seed;
  settings: typeof settings;
  socialAccounts: typeof socialAccounts;
  trendTimeline: typeof trendTimeline;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
