import { Page, Layout } from "@shopify/polaris";
import { DiscountTypeCard } from "../components/discount/DiscountTypeCard";
import { AppliesToCard } from "../components/discount/AppliesToCard";
import { TieredConfigCard } from "../components/discount/TieredConfigCard";
import { BundleConfigCard } from "../components/discount/BundleConfigCard";
import { AdvancedSettingsCard } from "../components/discount/AdvancedSettingsCard";
import { useState } from "react";
import { authenticate } from "../shopify.server";
import { useNavigate } from "react-router";

export async function loader({ request }) {
  const { admin, session } = await authenticate.admin(request);

  console.log("SESSION SHOP:", session.shop);

  return null;
}

export default function CreateDiscount() {
  const [discountType, setDiscountType] = useState("tiered");
  const navigate = useNavigate();
  
  return (
    <Page 
      title="Create discount"
      primaryAction={{
        content: "Save discount",
        onAction: () => { }
      }}
      secondaryActions={[{ 
        content: "Cancel",
        onAction: () => navigate("/app/discounts") 
      }]}
    >
      <Layout>
        <Layout.Section>
          <DiscountTypeCard discountType={discountType} setDiscountType={setDiscountType} />
        </Layout.Section>
        <Layout.Section>
          <AppliesToCard />
        </Layout.Section>
        <Layout.Section>
          {discountType === "tiered" ? (<TieredConfigCard />) : (<BundleConfigCard />)}
        </Layout.Section>
        <Layout.Section>
          <AdvancedSettingsCard />
        </Layout.Section>
      </Layout>
    </Page>
  );
}