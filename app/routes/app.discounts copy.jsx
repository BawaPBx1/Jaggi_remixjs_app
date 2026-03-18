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

import { useState, useCallback } from "react";
import { useNavigate } from "react-router";

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
  ];

  const resourceName = {
    singular: "discount",
    plural: "discounts",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(discounts);

  const { mode, setMode } = useSetIndexFiltersMode();

  const [queryValue, setQueryValue] = useState("");

  const handleQueryChange = useCallback((value) => {
    setQueryValue(value);
  }, []);

  const handleQueryClear = useCallback(() => {
    setQueryValue("");
  }, []);

  /* ---------------- SORT OPTIONS ---------------- */

  const sortOptions = [
    { label: "Newest first", value: "createdAt desc", directionLabel: "Newest" },
    { label: "Oldest first", value: "createdAt asc", directionLabel: "Oldest" },
    { label: "Title A-Z", value: "title asc", directionLabel: "A-Z" },
    { label: "Title Z-A", value: "title desc", directionLabel: "Z-A" },
  ];

  const [sortSelected, setSortSelected] = useState(["createdAt desc"]);

  /* ---------------- FILTER TABS ---------------- */

  const tabs = [
    { content: "All", index: 0 },
    { content: "Active", index: 1 },
    { content: "Draft", index: 2 },
  ];

  /* ---------------- BULK ACTIONS ---------------- */

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

  /* ---------------- TABLE ROWS ---------------- */

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

  /* ---------------- EMPTY STATE ---------------- */

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
        content: "Create discount",
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
              {rowMarkup}
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


// import {
//   Page,
//   Card,
//   IndexTable,
//   Text,
//   Badge,
//   Button,
//   InlineStack,
// } from "@shopify/polaris";
// import { useNavigate } from "react-router";

// export default function DiscountsPage() {
//   const navigate = useNavigate();

//   const discounts = [
//     {
//       id: "1",
//       title: "Summer Tier Discount",
//       type: "Tiered",
//       status: "Active",
//       createdAt: "Mar 10, 2026",
//     },
//     {
//       id: "2",
//       title: "Buy 4 for $999",
//       type: "Bundle",
//       status: "Draft",
//       createdAt: "Mar 12, 2026",
//     },
//   ];

//   const resourceName = {
//     singular: "discount",
//     plural: "discounts",
//   };

//   const rowMarkup = discounts.map((discount, index) => (
//     <IndexTable.Row id={discount.id} key={discount.id} position={index}>
//       <IndexTable.Cell>
//         <Text variant="bodyMd" fontWeight="bold">
//           {discount.title}
//         </Text>
//       </IndexTable.Cell>

//       <IndexTable.Cell>{discount.type}</IndexTable.Cell>

//       <IndexTable.Cell>
//         <Badge tone={discount.status === "Active" ? "success" : "attention"}>
//           {discount.status}
//         </Badge>
//       </IndexTable.Cell>

//       <IndexTable.Cell>{discount.createdAt}</IndexTable.Cell>
//     </IndexTable.Row>
//   ));

//   return (
//     <Page
//       title="Discounts"
//       primaryAction={{
//         content: "Create discount",
//         onAction: () => navigate("/app/discounts/new"),
//       }}
//     >
//       <Card>
//         <IndexTable
//           resourceName={resourceName}
//           itemCount={discounts.length}
//           headings={[
//             { title: "Discount title" },
//             { title: "Type" },
//             { title: "Status" },
//             { title: "Created" },
//           ]}
//           selectable={false}
//         >
//           {rowMarkup}
//         </IndexTable>
//       </Card>
//     </Page>
//   );
// }