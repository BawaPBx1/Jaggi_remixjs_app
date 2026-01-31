import { Outlet, useLoaderData, useRouteError } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { AppProvider } from "@shopify/shopify-app-react-router/react";
import { authenticate } from "../shopify.server";
import { upsertUser } from "../data_management/addUser"

export const loader = async ({ request }) => {
  await authenticate.admin(request);


    const { admin, session } = await authenticate.admin(request);
  
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
  
    const upsertUserData = await upsertUser({
      shop: session.shop,
      email: shop.email,
      store_name: shop.name,
      store_owner: shop.shopOwnerName,
      domain: shop.primaryDomain?.url,
      currency: shop.currencyCode,
      country_name: shop.billingAddress?.country,
      store_created_at: new Date(shop.createdAt),
    });

    console.log("checking upsertUserData :- ", upsertUserData);
  // eslint-disable-next-line no-undef
  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

export default function App() {
  const { apiKey } = useLoaderData();

  return (
    <AppProvider embedded apiKey={apiKey}>
      <s-app-nav>
        <s-link href="/app">Home</s-link>
        <s-link href="/app/pricing">Pricing</s-link>
        <s-link href="/app/additional">Additional page</s-link>
      </s-app-nav>
      <Outlet />
    </AppProvider>
  );
}

// Shopify needs React Router to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
