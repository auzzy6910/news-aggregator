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
import type * as locationNodes from "../locationNodes.js";
import type * as newsItems from "../newsItems.js";
import type * as predictions from "../predictions.js";
import type * as seed from "../seed.js";
import type * as socialAccounts from "../socialAccounts.js";
import type * as trendData from "../trendData.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  autoPostRules: typeof autoPostRules;
  locationNodes: typeof locationNodes;
  newsItems: typeof newsItems;
  predictions: typeof predictions;
  seed: typeof seed;
  socialAccounts: typeof socialAccounts;
  trendData: typeof trendData;
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
