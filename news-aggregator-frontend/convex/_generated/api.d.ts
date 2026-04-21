/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as automation from "../automation.js";
import type * as automationActions from "../automationActions.js";
import type * as autoPostRules from "../autoPostRules.js";
import type * as crons from "../crons.js";
import type * as locations from "../locations.js";
import type * as news from "../news.js";
import type * as predictions from "../predictions.js";
import type * as providers from "../providers.js";
import type * as seed from "../seed.js";
import type * as socialAccounts from "../socialAccounts.js";
import type * as trends from "../trends.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  automation: typeof automation;
  automationActions: typeof automationActions;
  autoPostRules: typeof autoPostRules;
  crons: typeof crons;
  locations: typeof locations;
  news: typeof news;
  predictions: typeof predictions;
  providers: typeof providers;
  seed: typeof seed;
  socialAccounts: typeof socialAccounts;
  trends: typeof trends;
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
