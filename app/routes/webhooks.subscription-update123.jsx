import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  const { shop, payload } = await authenticate.webhook(request);

  const subscription = payload?.app_subscription;
  if (!subscription) return new Response("OK");

  const user = await db.users.findUnique({
    where: { shop },
  });
  if (!user) return new Response("OK");

  await db.subscription.upsert({
    where: { subscription_id: subscription.id },
    update: {
      status: subscription.status,
    },
    create: {
      userId: user.id,
      plan_name: subscription.name,       // PRO / ENTERPRISE
      subscription_id: subscription.id,
      status: subscription.status,        // ACTIVE / CANCELLED / FROZEN
    },
  });

  await db.users.update({
    where: { id: user.id },
    data: {
      user_status:
        subscription.status === "ACTIVE" ? "paid" : "inactive",
    },
  });

  return new Response("OK");
};
