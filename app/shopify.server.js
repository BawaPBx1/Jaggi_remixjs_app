import "@shopify/shopify-app-react-router/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-react-router/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.October25,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,

  // ✅ ALL WEBHOOKS DEFINED HERE
  webhooks: {
    APP_UNINSTALLED: {
      deliveryMethod: "HTTP",
      callbackUrl: "/webhooks/app-uninstalled",
    },

    // 🔥 Billing webhook (THIS is the one you need)
    // APP_SUBSCRIPTIONS_UPDATE: {
    //   deliveryMethod: "HTTP",
    //   callbackUrl: "/webhooks/subscription-update",
    // },
    APP_SUBSCRIPTIONS_UPDATE: {
      deliveryMethod: "HTTP",
      callbackUrl: "/webhooks/subscription_update",
    },
    ORDERS_CREATE: {
      deliveryMethod: "HTTP",
      callbackUrl: "/webhooks/orders_create",
    },
  },
  hooks: {
    afterAuth: async ({ admin }) => {
      await admin.webhooks.register();
    },
  },

  future: {
    expiringOfflineAccessTokens: true,
  },

  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

export default shopify;

// Re-exports (unchanged)
export const apiVersion = ApiVersion.October25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
