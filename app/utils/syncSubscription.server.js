import prisma from "../db.server";

/* ---------------- GRAPHQL CHECK ---------------- */
export async function fetchActiveSubscriptionFromShopify(admin) {
  const response = await admin.graphql(`
    {
      currentAppInstallation {
        activeSubscriptions {
          id
          name
          trialDays
          test
          status
          currentPeriodEnd
          createdAt
        }
      }
    }
  `);

  const { data } = await response.json();

  return data?.currentAppInstallation?.activeSubscriptions?.[0] || null;
}

/* ---------------- DB SYNC ---------------- */
export async function syncSubscriptionFromShopify({
  shop,
  userId,
  subscription,
}) {
  return prisma.subscription.upsert({
    where: { subscription_id: subscription.id },
    update: mapSubscription(subscription),
    create: {
      userId,
      shop,
      subscription_id: subscription.id,
      ...mapSubscription(subscription),
    },
  });
}

/* ---------------- MAPPER ---------------- */
function mapSubscription(subscription) {
  return {
    plan_name: subscription.name,
    status: subscription.status.toLowerCase(),
    trial_days: subscription.trialDays,
    is_test: subscription.test,
    current_period_end: subscription.currentPeriodEnd
      ? new Date(subscription.currentPeriodEnd)
      : null,
    shopify_created_at: subscription.createdAt
      ? new Date(subscription.createdAt)
      : null,
  };
}
