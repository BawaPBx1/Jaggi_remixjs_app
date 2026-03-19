import { Page, Layout, TextField, Card, BlockStack, Text, FormLayout } from "@shopify/polaris";
import { DiscountTypeCard } from "../components/discount/DiscountTypeCard";
import { AppliesToCard } from "../components/discount/AppliesToCard";
import { TieredConfigCard } from "../components/discount/TieredConfigCard";
import { BundleConfigCard } from "../components/discount/BundleConfigCard";
import { AdvancedSettingsCard } from "../components/discount/AdvancedSettingsCard";
import { useState, useCallback } from "react";
import { authenticate } from "../shopify.server";
import { useNavigate, useSubmit, useActionData, redirect } from "react-router";
import prisma from "../db.server";

export async function loader({ request }) {
  await authenticate.admin(request);
  return null;
}

export async function action({ request }) {
  const { admin, session } = await authenticate.admin(request);
  const formData = await request.formData();
  const rawData = formData.get("discountData");

  if (!rawData) {
    return { error: "No data received" };
  }

  const data = JSON.parse(rawData);

  try {
    const discount = await prisma.discount.create({
      data: {
        shop: session.shop,
        title: data.title || "Untitled Discount",
        type: data.type.toUpperCase() === "TIERED" ? "TIERED" : "BUNDLE",
        appliesToType: data.appliesToType.toUpperCase() || "ALL_PRODUCTS",
        appliesToIds: data.appliesToIds || [],
        discountConfiguration: data.configuration,
        combineWithOthers: data.combineWithOthers || false,
        startsAt: data.startsAt ? new Date(data.startsAt) : null,
        endsAt: data.endsAt ? new Date(data.endsAt) : null,
        status: "DRAFT",
        isEnabled: false,
      },
    });

    console.log("Discount created:", discount.id);
    return redirect("/app/discounts");
  } catch (error) {
    console.error("Failed to create discount:", error);
    return { error: error.message || "Failed to create discount" };
  }
}

export default function CreateDiscount() {
  const navigate = useNavigate();
  const submit = useSubmit();
  const actionData = useActionData();

  // Centralized State
  const [title, setTitle] = useState("");
  const [discountType, setDiscountType] = useState("tiered");
  const [appliesToType, setAppliesToType] = useState("all");
  const [selectedItems, setSelectedItems] = useState([]);
  const [combineWithOthers, setCombineWithOthers] = useState(false);
  const [limitUsesPerCustomer, setLimitUsesPerCustomer] = useState(false);
  const [usageLimit, setUsageLimit] = useState("1");
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");

  // Tiered Config State
  const [tiers, setTiers] = useState([
    { qty: "1", discount: "10" },
    { qty: "2", discount: "15" }
  ]);

  // Bundle Config State
  const [bundleQty, setBundleQty] = useState("4");
  const [bundlePrice, setBundlePrice] = useState("999");

  const selectResources = async () => {
    // Structure selectionIds for product picker to handle variants correctly
    const groupedSelection = [];
    selectedItems.forEach(item => {
      const prodId = item.productId || item.id;
      let target = groupedSelection.find(g => g.id === prodId);
      if (!target) {
        target = { id: prodId, variants: [] };
        groupedSelection.push(target);
      }
      if (item.productId) {
        target.variants.push({ id: item.id });
      } else {
        delete target.variants;
      }
    });

    const products = await window.shopify.resourcePicker({
      type: appliesToType === "products" ? "product" : "collection",
      action: "select",
      multiple: true,
      selectionIds: groupedSelection
    });

    if (products) {
      const flattened = [];
      products.forEach(p => {
        if (p.variants && p.variants.length > 0) {
          p.variants.forEach(v => {
            flattened.push({
              id: v.id,
              title: v.displayName || `${p.title} - ${v.title}`,
              productId: p.id
            });
          });
        } else {
          flattened.push({
            id: p.id,
            title: p.title
          });
        }
      });
      setSelectedItems(flattened);
    }
  };

  const handleSave = () => {
    const configuration = discountType === "tiered"
      ? { tiers }
      : { bundleQty, bundlePrice };

    const data = {
      title,
      type: discountType,
      appliesToType: appliesToType === "all" ? "ALL_PRODUCTS" : appliesToType === "products" ? "PRODUCTS" : "COLLECTIONS",
      appliesToIds: selectedItems,
      configuration: {
        ...configuration,
        limitUsesPerCustomer,
        usageLimit: limitUsesPerCustomer ? parseInt(usageLimit) : null,
        scheduleEnabled
      },
      combineWithOthers,
      startsAt: scheduleEnabled && startsAt ? startsAt : null,
      endsAt: scheduleEnabled && endsAt ? endsAt : null
    };

    submit({ discountData: JSON.stringify(data) }, { method: "post" });
  };

  return (
    <Page
      title="Create discount"
      backAction={{ content: "Discounts", onAction: () => navigate("/app/discounts") }}
      primaryAction={{
        content: "Save discount",
        onAction: handleSave,
      }}
      secondaryActions={[{
        content: "Cancel",
        onAction: () => navigate("/app/discounts")
      }]}
    >
      <Layout>
        {actionData?.error && (
          <Layout.Section>
            <div style={{ color: "red", padding: "10px", background: "#fdf0f0", borderRadius: "4px" }}>
              {actionData.error}
            </div>
          </Layout.Section>
        )}
        <Layout.Section>
          <Card>
            <FormLayout>
              <TextField
                label="Discount title"
                value={title}
                onChange={setTitle}
                autoComplete="off"
                placeholder="e.g. Summer sale"
              />
            </FormLayout>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <DiscountTypeCard
            discountType={discountType}
            setDiscountType={setDiscountType}
          />
        </Layout.Section>

        <Layout.Section>
          <AppliesToCard
            selected={appliesToType}
            onSelect={(val) => {
              setAppliesToType(val);
              setSelectedItems([]);
            }}
            selectedItems={selectedItems}
            onBrowse={selectResources}
          />
        </Layout.Section>

        <Layout.Section>
          {discountType === "tiered" ? (
            <TieredConfigCard
              tiers={tiers}
              onTiersChange={setTiers}
            />
          ) : (
            <BundleConfigCard
              qty={bundleQty}
              onQtyChange={setBundleQty}
              price={bundlePrice}
              onPriceChange={setBundlePrice}
            />
          )}
        </Layout.Section>

        <Layout.Section>
          <AdvancedSettingsCard
            combineWithOthers={combineWithOthers}
            onCombineChange={setCombineWithOthers}
            limitUsesPerCustomer={limitUsesPerCustomer}
            onLimitUsesChange={setLimitUsesPerCustomer}
            usageLimit={usageLimit}
            onUsageLimitChange={setUsageLimit}
            scheduleEnabled={scheduleEnabled}
            onScheduleEnabledChange={setScheduleEnabled}
            startsAt={startsAt}
            onStartsAtChange={setStartsAt}
            endsAt={endsAt}
            onEndsAtChange={setEndsAt}
          />
        </Layout.Section>
        <Layout.Section>
          <div style={{ height: "5rem" }} />
        </Layout.Section>
      </Layout>
    </Page>
  );
}