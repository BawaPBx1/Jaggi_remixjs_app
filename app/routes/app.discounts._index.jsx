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
import prisma from "../db.server";

import { useState, useCallback } from "react";
import { useNavigate, useLoaderData } from "react-router";

export async function loader({ request }) {
  const { admin, session } = await authenticate.admin(request);
  
  const discounts = await prisma.discount.findMany({
    where: { shop: session.shop, isDeleted: false },
    orderBy: { createdAt: "desc" },
  });

  return { 
    discounts: discounts.map(d => ({
      ...d,
      createdAt: new Date(d.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      })
    }))
  };
}

export default function DiscountsPage() {
  const navigate = useNavigate();
  const { discounts } = useLoaderData();

  const resourceName = {
    singular: "discount",
    plural: "discounts",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
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
        onAction: () => navigate("/app/discounts/new"),
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
          onSelect={() => { }}
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
                    <Badge tone="info">{discount.type.charAt(0) + discount.type.slice(1).toLowerCase()}</Badge>
                  </IndexTable.Cell>

                  <IndexTable.Cell>
                    <Badge tone={discount.status === "ACTIVE" ? "success" : "attention"}>
                      {discount.status === "ACTIVE" ? "Active" : "Draft"}
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
                hasNext={false}
                onPrevious={() => { }}
                onNext={() => { }}
              />
            </div>
          </>
        )}
      </Card>
    </Page>
  );
}
