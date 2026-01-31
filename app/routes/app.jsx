import { Outlet, useLoaderData, useRouteError } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import {
  AppProvider as ShopifyAppProvider,
} from "@shopify/shopify-app-react-router/react";
import { AppProvider as PolarisProvider } from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";

import { authenticate } from "../shopify.server";
import { upsertUser } from "../data_management/addUser";

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);

  if (admin.webhooks && typeof admin.webhooks.register === "function") {
    await admin.webhooks.register();
  }

  const response = await admin.graphql(`
    {
      shop {
        id
        name
        email
        myshopifyDomain
        currencyCode
        createdAt
        shopOwnerName
        billingAddress {
          country
        }
        primaryDomain {
          url
        }
      }
    }
  `);

  const { data } = await response.json();
  const shop = data.shop;

  await upsertUser({
    shop: session.shop,
    email: shop.email,
    store_name: shop.name,
    store_owner: shop.shopOwnerName,
    domain: shop.primaryDomain?.url,
    currency: shop.currencyCode,
    country_name: shop.billingAddress?.country,
    store_created_at: new Date(shop.createdAt),
  });

  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

export default function App() {
  const { apiKey } = useLoaderData();

  return (
    <ShopifyAppProvider embedded apiKey={apiKey}>
      <PolarisProvider i18n={enTranslations}>
        <s-app-nav>
          <s-link href="/app">Home</s-link>
          <s-link href="/app/pricing">Pricing</s-link>
          <s-link href="/app/additional">Additional page</s-link>
        </s-app-nav>

        <Outlet />
      </PolarisProvider>
    </ShopifyAppProvider>
  );
}

// Required by Shopify
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
