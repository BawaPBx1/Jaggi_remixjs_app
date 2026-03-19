import { Page, Layout, TextField, Card, BlockStack, Text, FormLayout } from "@shopify/polaris";
import { DiscountTypeCard } from "../components/discount/DiscountTypeCard";
import { AppliesToCard } from "../components/discount/AppliesToCard";
import { TieredConfigCard } from "../components/discount/TieredConfigCard";
import { BundleConfigCard } from "../components/discount/BundleConfigCard";
import { AdvancedSettingsCard } from "../components/discount/AdvancedSettingsCard";
import { useState } from "react";
import { authenticate } from "../shopify.server";
import { useNavigate, useSubmit, useActionData, useLoaderData, redirect } from "react-router";
import prisma from "../db.server";

export async function loader({ request, params }) {
  const { admin, session } = await authenticate.admin(request);
  const discountId = params.id;

  const discount = await prisma.discount.findFirst({
    where: { 
      id: discountId,
      shop: session.shop 
    },
  });

  if (!discount) {
    throw new Response("Not Found", { status: 404 });
  }

  // Fetch titles for appliesToIds to ensure names are displayed
  if (discount.appliesToIds && Array.isArray(discount.appliesToIds) && discount.appliesToIds.length > 0) {
    const idsToFetch = discount.appliesToIds
      .map(item => (typeof item === 'string' ? item : item.id))
      .filter(id => !!id);

    if (idsToFetch.length > 0) {
      try {
        const response = await admin.graphql(
          `#graphql
          query getResources($ids: [ID!]!) {
            nodes(ids: $ids) {
              ... on Product {
                id
                title
              }
              ... on ProductVariant {
                id
                displayName
                product {
                  id
                }
              }
              ... on Collection {
                id
                title
              }
            }
          }`,
          { variables: { ids: idsToFetch } }
        );
        const jsonResponse = await response.json();
        const nodes = jsonResponse.data?.nodes;
        
        if (nodes) {
          discount.appliesToIds = nodes
            .filter(node => node !== null)
            .map(node => ({ 
              id: node.id, 
              title: node.displayName || node.title,
              productId: node.product?.id // Store parent product ID
            }));
        }
      } catch (e) {
        console.error("Error fetching resource titles:", e);
      }
    }
  }

  return { discount };
}

export async function action({ request, params }) {
  const { session } = await authenticate.admin(request);
  const discountId = params.id;
  const formData = await request.formData();
  const rawData = formData.get("discountData");
  
  if (!rawData) {
     return { error: "No data received" };
  }

  const data = JSON.parse(rawData);

  try {
    const discount = await prisma.discount.update({
      where: { 
        id: discountId,
        shop: session.shop
      },
      data: {
        title: data.title || "Untitled Discount",
        type: data.type.toUpperCase() === "TIERED" ? "TIERED" : "BUNDLE",
        appliesToType: data.appliesToType.toUpperCase() || "ALL_PRODUCTS",
        appliesToIds: data.appliesToIds || [],
        discountConfiguration: data.configuration,
        combineWithOthers: data.combineWithOthers || false,
        startsAt: data.startsAt ? new Date(data.startsAt) : null,
        endsAt: data.endsAt ? new Date(data.endsAt) : null,
      },
    });

    console.log("Discount updated:", discount.id);
    return redirect("/app/discounts");
  } catch (error) {
    console.error("Failed to update discount:", error);
    return { error: error.message || "Failed to update discount" };
  }
}

export default function EditDiscount() {
  const navigate = useNavigate();
  const submit = useSubmit();
  const actionData = useActionData();
  const { discount } = useLoaderData();

  // Initial state from discount
  const [title, setTitle] = useState(discount.title);
  const [discountType, setDiscountType] = useState(discount.type.toLowerCase());
  const [appliesToType, setAppliesToType] = useState(
    discount.appliesToType === "ALL_PRODUCTS" ? "all" : (discount.appliesToType === "PRODUCTS" ? "products" : "collections")
  );
  const [selectedItems, setSelectedItems] = useState(discount.appliesToIds || []);
  const [combineWithOthers, setCombineWithOthers] = useState(discount.combineWithOthers);
  
  // Tiered Config State
  const [tiers, setTiers] = useState(
    discount.type === "TIERED" ? discount.discountConfiguration.tiers : [
      { qty: "1", discount: "10" },
      { qty: "2", discount: "15" }
    ]
  );
  
  // Bundle Config State
  const [bundleQty, setBundleQty] = useState(
    discount.type === "BUNDLE" ? discount.discountConfiguration.bundleQty : "4"
  );
  const [bundlePrice, setBundlePrice] = useState(
    discount.type === "BUNDLE" ? discount.discountConfiguration.bundlePrice : "999"
  );
  
  // Helper to format Date to datetime-local string
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const z = (n) => (n < 10 ? "0" + n : n);
    return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}T${z(d.getHours())}:${z(d.getMinutes())}`;
  };

  // Advanced Settings State
  const [limitUsesPerCustomer, setLimitUsesPerCustomer] = useState(discount.discountConfiguration.limitUsesPerCustomer || false);
  const [usageLimit, setUsageLimit] = useState(discount.discountConfiguration.usageLimit?.toString() || "1");
  const [scheduleEnabled, setScheduleEnabled] = useState(discount.discountConfiguration.scheduleEnabled || false);
  const [startsAt, setStartsAt] = useState(formatDate(discount.startsAt));
  const [endsAt, setEndsAt] = useState(formatDate(discount.endsAt));

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
        delete target.variants; // No variants key means select the whole product
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
      title="Edit discount"
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
