import { TitleBar } from "@shopify/app-bridge-react";
import {
  Page,
  Layout,
  Card,
  Text,
  Button,
  BlockStack,
  InlineStack,
  Box,
  Divider,
  List,
} from "@shopify/polaris";
import { createBilling } from "../utils/createBilling.server";
import { useState } from "react";

import { authenticate } from "../shopify.server";

/* ---------------- LOADER ---------------- */
export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

/* ---------------- ACTION ---------------- */
export const action = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);

  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return new Response("Invalid content type", { status: 400 });
  }

  const body = await request.json();
  const planName = body?.plan_name;

  if (!planName) {
    return new Response(JSON.stringify({ error: "Plan required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { buySubscription } = await import(
    "../utils/buySubscription.server"
  );

  await buySubscription(session, admin, planName);

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState(null);

  const handleSubscribe = async (planName) => {
    setLoadingPlan(planName);

    try {
      await fetch("/app/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan_name: planName }),
      });

      // Optional: reload to reflect current plan
      window.location.reload();
    } catch (err) {
      console.error("Subscription failed", err);
    } finally {
      setLoadingPlan(null);
    }
  };

  const plans = [
    { title: "Free", button: "Current Plan" },
    { title: "Pro", button: "Upgrade to Pro", primary: true },
    { title: "Enterprise", button: "Choose Enterprise", primary: true },
  ];

  return (
    <Page>
      <TitleBar title="Pricing" />

      <BlockStack gap="600">
        <Card padding="600">
          <BlockStack gap="400" align="center">
            <Text variant="heading2xl" as="h1" alignment="center">
              Simple & Transparent Pricing
            </Text>
            <Text color="subdued" alignment="center" as="p">
              Unlock powerful features designed to help your Shopify store grow.
            </Text>
            <Text variant="headingLg" alignment="center">
              Trusted by 2000+ Shopify Merchants
            </Text>
            <Text alignment="center" color="subdued">
              Join thousands of brands using our app to scale their eCommerce business.
            </Text>
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="600">
            <Text variant="headingLg" as="h2">
              Everything You Need to Grow
            </Text>

            <InlineStack gap="400" wrap>
              <Card>
                <BlockStack gap="200">
                  <Text variant="headingMd">AI Recommendations</Text>
                  <Text color="subdued">
                    Boost conversions with smart suggestions
                  </Text>
                </BlockStack>
              </Card>

              <Card>
                <BlockStack gap="200">
                  <Text variant="headingMd">Advanced Analytics</Text>
                  <Text color="subdued">
                    Track performance with detailed insights
                  </Text>
                </BlockStack>
              </Card>

              <Card>
                <BlockStack gap="200">
                  <Text variant="headingMd">Smart Automation</Text>
                  <Text color="subdued">
                    Reduce manual work with auto-sync & alerts
                  </Text>
                </BlockStack>
              </Card>

              <Card>
                <BlockStack gap="200">
                  <Text variant="headingMd">Bulk Actions</Text>
                  <Text color="subdued">
                    Manage large product catalogs with ease
                  </Text>
                </BlockStack>
              </Card>
            </InlineStack>
          </BlockStack>
        </Card>

        <Box background="bg-surface" paddingBlock="800">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(30%, 1fr))",
              gap: "24px",
              width: "100%",
              maxWidth: "1400px",
              margin: "0 auto",
              padding: "0 20px",
            }}
          >
            {[
              {
                title: "Free",
                subtitle: "Perfect for testing your store",
                price: "$0/mo",
                features: [
                  "Basic analytics",
                  "Up to 100 orders/month",
                  "Email-only support",
                  "Manual sync",
                  "Basic dashboard insights",
                  "Limited product sync",
                  "Standard API rate limits",
                  "Theme compatibility check",
                  "Community support",
                ],
                button: "Current Plan",
              },
              {
                title: "Pro",
                subtitle: "Best for growing stores",
                price: "$19/mo",
                features: [
                  "Unlimited orders",
                  "Automation tools",
                  "Advanced analytics",
                  "Priority email + chat support",
                  "Real-time sync",
                  "Abandoned checkout tracking",
                  "Enhanced reporting dashboard",
                  "Daily performance alerts",
                  "Multi-location support",
                  "Priority troubleshooting",
                ],
                button: "Upgrade to Pro",
                primary: true,
              },
              {
                title: "Enterprise",
                subtitle: "For large brands",
                price: "$49/mo",
                features: [
                  "All Pro features",
                  "AI-powered automation",
                  "Dedicated account manager",
                  "Custom integrations",
                  "Unlimited automation rules",
                  "AI-based sales forecasting",
                  "Multi-store management",
                  "Advanced security controls",
                  "24/7 premium support",
                  "SLA-backed performance guarantee",
                  "Team access & permission controls",
                  "Personal onboarding session",
                ],
                button: "Choose Enterprise",
                primary: true,
              },
            ].map((plan) => (
              <Card key={plan.title}>
                <div className="ctm_plans_card">
                  <BlockStack
                    gap="300"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <Text as="h3" variant="headingLg">
                      {plan.title}
                    </Text>
                    <Text color="subdued">{plan.subtitle}</Text>

                    <Box paddingBlock="400">
                      <Text variant="heading2xl">{plan.price}</Text>
                    </Box>

                    <List type="bullet">
                      {plan.features.map((f) => (
                        <List.Item key={f}>{f}</List.Item>
                      ))}
                    </List>
                  </BlockStack>

                  <div style={{ marginTop: "auto" }}>
                    {/* <Button
                      fullWidth
                      variant={plan.primary ? "primary" : undefined}
                    >
                      {plan.button}
                    </Button> */}
                    <Button
                      fullWidth
                      variant={plan.primary ? "primary" : undefined}
                      onClick={() => handleSubscribe(plan.title)}
                    >
                      {plan.button}
                    </Button>
                    {/* <Form method="post">
                      <input type="hidden" name="plan_name" value={plan.title} />
                      <Button
                        submit
                        fullWidth
                        variant={plan.primary ? "primary" : undefined}
                      >
                        {plan.button}
                      </Button>
                    </Form> */}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Box>

        <Card>
          <BlockStack gap="500">
            <Text variant="headingLg" as="h2">
              Frequently Asked Questions
            </Text>

            <BlockStack gap="300">
              <Box>
                <Text variant="headingMd">Is there a free plan?</Text>
                <Text color="subdued">
                  Yes, the free plan gives you access to basic features with no
                  credit card required.
                </Text>
              </Box>

              <Divider />

              <Box>
                <Text variant="headingMd">Can I cancel anytime?</Text>
                <Text color="subdued">
                  Absolutely — there are no long-term commitments.
                </Text>
              </Box>

              <Divider />

              <Box>
                <Text variant="headingMd">Do you offer support?</Text>
                <Text color="subdued">
                  All users get support. Pro and Enterprise users receive
                  priority assistance.
                </Text>
              </Box>
            </BlockStack>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}
