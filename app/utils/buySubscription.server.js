import prisma from "../db.server";

export const buySubscription = async (session, admin, planName) => {
  try {
    /* ---------------------------------
       FETCH SHOP DATA FROM SHOPIFY
    ---------------------------------- */
    const response = await admin.graphql(`
      {
        shop {
          id
          name
          email
          currencyCode
          createdAt
          myshopifyDomain
        }
      }
    `);

    const parsedResponse = await response.json();
    const shop = parsedResponse?.data?.shop;

    if (!shop) {
      throw new Error("Shop data not found from Shopify");
    }

    /* ---------------------------------
       UPSERT USER (CREATE OR UPDATE)
    ---------------------------------- */
    const user = await prisma.users.upsert({
      where: {
        shop: session.shop,
      },
      update: {
        store_name: shop.name,
        currency: shop.currencyCode,
        email: shop.email,
        store_id: shop.id,
        store_created_at: new Date(shop.createdAt),
        domain: shop.myshopifyDomain,
        user_status: "ACTIVE",
        last_login: new Date(),
      },
      create: {
        shop: session.shop,
        domain: shop.myshopifyDomain,
        store_name: shop.name,
        currency: shop.currencyCode,
        email: shop.email,
        store_id: shop.id,
        store_created_at: new Date(shop.createdAt),
        user_status: "ACTIVE",
      },
    });

    /* ---------------------------------
       CANCEL PREVIOUS ACTIVE PLANS
    ---------------------------------- */
    await prisma.subscription.updateMany({
      where: {
        userId: user.id,
        status: "active",
      },
      data: {
        status: "cancelled",
      },
    });

    /* ---------------------------------
       CREATE NEW SUBSCRIPTION
    ---------------------------------- */
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        plan_name: planName,
        subscription_id: `manual_${Date.now()}`, // replace later with Shopify Billing ID
        status: "active",
      },
    });

    return {
      success: true,
      user,
      subscription,
    };
  } catch (error) {
    console.error("buySubscription error:", error);
    return {
      success: false,
      error: error.message || "Subscription failed",
    };
  }
};
