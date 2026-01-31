import prisma from "../db.server";
import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  try {
    const { topic, shop, payload } = await authenticate.webhook(request);

    if (topic !== "APP_SUBSCRIPTIONS_UPDATE") {
      return new Response("Ignored", { status: 200 });
    }

    console.log("📦 Billing webhook payload:", JSON.stringify(payload, null, 2), topic, shop);

    // Shopify may send different shapes
    const subscription =
      payload.app_subscription ||
      payload.subscriptions?.[0];

    if (!subscription) {
      console.warn("⚠️ No subscription found in payload");
      return new Response("No subscription", { status: 200 });
    }

    const user = await prisma.users.findUnique({
      where: { shop },
    });

    if (!user) {
      console.warn(`⚠️ User not found for shop: ${shop}`);
      return new Response("User not found", { status: 200 });
    }

    await prisma.subscription.upsert({
      where: {
        subscription_id: subscription.id, // MUST be @unique
      },
      update: {
        status: subscription.status.toLowerCase(),
        plan_name: subscription.name,
      },
      create: {
        userId: user.id,
        shop,
        subscription_id: subscription.id,
        plan_name: subscription.name,
        status: subscription.status.toLowerCase(),
      },
    });

    console.log("✅ Subscription updated:", subscription.id);

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("❌ Billing webhook error:", error);
    return new Response("Webhook error", { status: 500 });
  }
};
