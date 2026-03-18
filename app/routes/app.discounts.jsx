import {
  Page,
  Card,
  IndexTable,
  Text,
  Badge,
  IndexFilters,
  useIndexResourceState,
  useSetIndexFiltersMode,
  EmptyState,
  Pagination,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";

import { useState, useCallback } from "react";
import { useNavigate } from "react-router";

export async function loader({ request }) {
  const { admin, session } = await authenticate.admin(request);

  console.log("SESSION SHOP:", session.shop);

  return null;
}

export default function DiscountsPage() {
  const navigate = useNavigate();

  const discounts = [
    {
      id: "1",
      title: "Summer Tier Discount",
      type: "Tiered",
      status: "Active",
      createdAt: "Mar 10, 2026",
    },
    {
      id: "2",
      title: "Buy 4 for $999",
      type: "Bundle",
      status: "Draft",
      createdAt: "Mar 12, 2026",
    },
    {
      id: "3",
      title: "Winter Sale 15%",
      type: "Tiered",
      status: "Active",
      createdAt: "Feb 02, 2026",
    },
    {
      id: "4",
      title: "Holiday Bundle Pack",
      type: "Bundle",
      status: "Active",
      createdAt: "Dec 18, 2025",
    },
    {
      id: "5",
      title: "Black Friday Deal",
      type: "Tiered",
      status: "Draft",
      createdAt: "Nov 20, 2025",
    },
    {
      id: "6",
      title: "Buy 3 Get Discount",
      type: "Tiered",
      status: "Active",
      createdAt: "Jan 05, 2026",
    },
    {
      id: "7",
      title: "Starter Bundle Offer",
      type: "Bundle",
      status: "Draft",
      createdAt: "Jan 15, 2026",
    },
    {
      id: "8",
      title: "VIP Customer Discount",
      type: "Tiered",
      status: "Active",
      createdAt: "Mar 01, 2026",
    },
    {
      id: "9",
      title: "Weekend Flash Bundle",
      type: "Bundle",
      status: "Active",
      createdAt: "Mar 14, 2026",
    },
    {
      id: "10",
      title: "Clearance Sale 25%",
      type: "Tiered",
      status: "Draft",
      createdAt: "Feb 28, 2026",
    },
  ];

  const resourceName = {
    singular: "discount",
    plural: "discounts",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    // useIndexResourceState(discounts);
    useIndexResourceState(discounts, {
        resourceIDResolver: (discount) => discount.id,
    });

  const { mode, setMode } = useSetIndexFiltersMode();

  const [queryValue, setQueryValue] = useState("");

  const handleQueryChange = useCallback((value) => {
    setQueryValue(value);
  }, []);

  const handleQueryClear = useCallback(() => {
    setQueryValue("");
  }, []);

  const sortOptions = [
    { label: "Newest first", value: "createdAt desc", directionLabel: "Newest" },
    { label: "Oldest first", value: "createdAt asc", directionLabel: "Oldest" },
    { label: "Title A-Z", value: "title asc", directionLabel: "A-Z" },
    { label: "Title Z-A", value: "title desc", directionLabel: "Z-A" },
  ];

  const [sortSelected, setSortSelected] = useState(["createdAt desc"]);

  const tabs = [
    { id: "all", content: "All", index: 0 },
    { id: "active", content: "Active", index: 1 },
    { id: "draft", content: "Draft", index: 2 },
  ];

  const bulkActions = [
    {
      content: "Activate discounts",
      onAction: () => console.log("Activate", selectedResources),
    },
    {
      content: "Delete discounts",
      destructive: true,
      onAction: () => console.log("Delete", selectedResources),
    },
  ];

  const rowMarkup = discounts.map((discount, index) => (
    <IndexTable.Row
      id={discount.id}
      key={discount.id}
      position={index}
      onClick={() => navigate(`/app/discounts/${discount.id}`)}
    >
      <IndexTable.Cell>
        <Text variant="bodyMd" fontWeight="semibold">
          {discount.title}
        </Text>
      </IndexTable.Cell>

      <IndexTable.Cell>
        <Badge tone="info">{discount.type}</Badge>
      </IndexTable.Cell>

      <IndexTable.Cell>
        <Badge tone={discount.status === "Active" ? "success" : "attention"}>
          {discount.status}
        </Badge>
      </IndexTable.Cell>

      <IndexTable.Cell>
        <Text variant="bodySm">{discount.createdAt}</Text>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  const emptyStateMarkup = (
    <EmptyState
      heading="Create your first discount"
      action={{
        content: "Create discount",
        onAction: () => navigate("/app/discounts/new"),
      }}
      image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
    >
      <p>Create tiered or bundle discounts for your customers.</p>
    </EmptyState>
  );

  return (
    <Page
  title="Discounts"
  primaryAction={{
    content: "Create discounts",
    url: "/app/discounts/new",
  }}
>
      <Card padding="0">
        <IndexFilters
          queryValue={queryValue}
          queryPlaceholder="Search discounts"
          onQueryChange={handleQueryChange}
          onQueryClear={handleQueryClear}
          tabs={tabs}
          selected={0}
          onSelect={() => {}}
          sortOptions={sortOptions}
          sortSelected={sortSelected}
          onSort={setSortSelected}
          canCreateNewView={false}
          filters={[]}
          appliedFilters={[]}
          mode={mode}
          setMode={setMode}
        />

        {discounts.length === 0 ? (
          emptyStateMarkup
        ) : (
          <>
            {/* <IndexTable
              resourceName={resourceName}
              itemCount={discounts.length}
              selectedItemsCount={
                allResourcesSelected ? "All" : selectedResources.length
              }
              onSelectionChange={handleSelectionChange}
              bulkActions={bulkActions}
              headings={[
                { title: "Discount" },
                { title: "Type" },
                { title: "Status" },
                { title: "Created" },
              ]}
            >
              {rowMarkup}
            </IndexTable> */}
            <IndexTable
                resourceName={resourceName}
                itemCount={discounts.length}
                selectedItemsCount={
                    allResourcesSelected ? "All" : selectedResources.length
                }
                onSelectionChange={handleSelectionChange}
                bulkActions={bulkActions}
                headings={[
                    { title: "Discount" },
                    { title: "Type" },
                    { title: "Status" },
                    { title: "Created" },
                ]}
                >
                {discounts.map((discount, index) => (
                    <IndexTable.Row
                    id={discount.id}
                    key={discount.id}
                    position={index}
                    selected={selectedResources.includes(discount.id)}
                    onClick={() => navigate(`/app/discounts/${discount.id}`)}
                    >
                    <IndexTable.Cell>
                        <Text variant="bodyMd" fontWeight="semibold">
                        {discount.title}
                        </Text>
                    </IndexTable.Cell>

                    <IndexTable.Cell>
                        <Badge tone="info">{discount.type}</Badge>
                    </IndexTable.Cell>

                    <IndexTable.Cell>
                        <Badge tone={discount.status === "Active" ? "success" : "attention"}>
                        {discount.status}
                        </Badge>
                    </IndexTable.Cell>

                    <IndexTable.Cell>
                        <Text variant="bodySm">{discount.createdAt}</Text>
                    </IndexTable.Cell>
                    </IndexTable.Row>
                ))}
                </IndexTable>

            <div style={{ padding: "16px" }}>
              <Pagination
                hasPrevious={false}
                hasNext={true}
                onPrevious={() => {}}
                onNext={() => {}}
              />
            </div>
          </>
        )}
      </Card>
    </Page>
  );
}